const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

export const api = {
    get: (url: string, options?: RequestOptions) => request(url, { ...options, method: 'GET' }),
    post: (url: string, body: any, options?: RequestOptions) => request(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (url: string, body: any, options?: RequestOptions) => request(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    patch: (url: string, body: any, options?: RequestOptions) => request(url, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
    delete: (url: string, options?: RequestOptions) => request(url, { ...options, method: 'DELETE' }),
};

async function request(url: string, options: RequestOptions = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });

    if (response.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/refresh')) {
        try {
            // Attempt refresh - send refresh token in body if available
            const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
            const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Important for sending httpOnly cookie
                body: refreshToken ? JSON.stringify({ refreshToken }) : undefined,
            });

            // Handle rate limiting during refresh
            if (refreshRes.status === 429) {
                throw new Error('Too many requests. Please wait a moment and try again.');
            }
            if (!refreshRes.ok) throw new Error('Refresh failed');

            const data = await refreshRes.json();
            const newAccessToken = data.accessToken;
            const newRefreshToken = data.refreshToken;

            if (typeof window !== 'undefined') {
                localStorage.setItem('accessToken', newAccessToken);
                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken);
                }
            }

            // Retry original request
            const newHeaders = { ...headers, 'Authorization': `Bearer ${newAccessToken}` };
            const retryResponse = await fetch(`${API_URL}${url}`, {
                ...options,
                headers: newHeaders,
            });

            if (!retryResponse.ok) {
                // Handle rate limiting during retry
                if (retryResponse.status === 429) {
                    throw new Error('Too many requests. Please wait a moment and try again.');
                }
                
                const error = await retryResponse.json().catch(() => ({ error: 'An error occurred' }));
                throw new Error(error.error || retryResponse.statusText);
            }
            return retryResponse.json();

        } catch (e) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            throw new Error('Session expired');
        }
    }

    if (!response.ok) {
        // Handle rate limiting specifically
        if (response.status === 429) {
            throw new Error('Too many requests. Please wait a moment and try again.');
        }
        
        const error = await response.json().catch(() => ({ error: 'An error occurred' }));
        throw new Error(error.error || response.statusText);
    }

    return response.json();
}
