import axios from 'axios';

// Create an axios instance with default settings
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  }
});

// Request interceptor for logging and modifying requests
apiClient.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for standardizing error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Standardize error messages
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // The request was made and the server responded with an error status
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = `Server error: ${error.response.status}`;
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please check your connection.';
    } 
    
    // Create a standardized error object
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.statusCode = error.response?.status;
    
    return Promise.reject(enhancedError);
  }
);

// API functions
export const processImage = async (imageFile, gridSize) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('gridSize', gridSize.toString());
  
  try {
    const response = await apiClient.post('/process-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSchematic = async (imageId) => {
  try {
    const response = await apiClient.get(`/get-schematic/${imageId}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;
