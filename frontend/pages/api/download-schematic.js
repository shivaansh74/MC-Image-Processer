import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Get image ID from query parameters
  const { imageId } = req.query;

  if (!imageId) {
    return res.status(400).json({ message: 'Image ID is required' });
  }

  try {
    // Request schematic file from backend
    const response = await axios.get(`http://localhost:5000/get-schematic/${imageId}`, {
      responseType: 'arraybuffer'
    });

    // Set appropriate headers for download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=minecraft-art.schematic');
    
    // Send the schematic file data
    return res.send(Buffer.from(response.data));
  } catch (error) {
    console.error('Error downloading schematic:', error);
    return res.status(500).json({ message: 'Failed to download schematic file' });
  }
}
