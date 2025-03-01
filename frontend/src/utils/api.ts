import { endpoints } from '../config/api';

export async function uploadImage(file: File, gridSize: number) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('grid_size', gridSize.toString());

  try {
    const response = await fetch(endpoints.convertImage, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function checkAPIHealth() {
  try {
    const response = await fetch(endpoints.healthCheck);
    return response.ok;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
}