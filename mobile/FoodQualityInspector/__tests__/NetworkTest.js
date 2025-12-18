// Simple network test to verify connectivity
const testNetworkConnectivity = async () => {
  try {
    // Test if we can reach the backend API
    const response = await fetch('http://192.168.1.16:5001/api/health');
    const data = await response.json();
    console.log('Backend API connectivity test:', data);
    
    // Test if we can reach the Metro bundler
    const bundleResponse = await fetch('http://192.168.1.16:8081/status');
    console.log('Metro bundler status:', bundleResponse.status);
    
    return { success: true, data: { api: data, bundlerStatus: bundleResponse.status } };
  } catch (error) {
    console.error('Network connectivity test failed:', error);
    return { success: false, error: error.message };
  }
};

export default testNetworkConnectivity;