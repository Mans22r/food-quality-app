import api from './api';

export const getForms = async () => {
  try {
    const response = await api.get('/forms');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch forms' 
    };
  }
};

export const getFormById = async (id) => {
  try {
    const response = await api.get(`/forms/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch form' 
    };
  }
};

export const submitReport = async (formData) => {
  try {
    const response = await api.post('/reports', formData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to submit report' 
    };
  }
};