const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const endpoints = {
  convertImage: `${API_URL}/convert-image`,
  healthCheck: `${API_URL}/`
};

export default API_URL;