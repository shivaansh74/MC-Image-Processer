import { IncomingForm } from 'formidable';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

// Disable the default body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  let files = {};
  try {
    // Parse the form data with newer formidable API
    const form = new IncomingForm({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      keepExtensions: true,
    });
    
    // Use the updated formidable promise API
    const [fields, formFiles] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });
    
    // Store files for cleanup in finally block
    files = formFiles;
    
    console.log("Form files:", files);
    console.log("Form fields:", fields);

    // Check if an image was uploaded
    if (!files || !files.image) {
      return res.status(400).json({ message: 'No image uploaded. Make sure you are sending a file with name "image".' });
    }

    // Fix: Handle the array structure that formidable returns in Next.js
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
    
    console.log("Image file info:", {
      mimetype: imageFile.mimetype,
      originalFilename: imageFile.originalFilename,
      filepath: imageFile.filepath,
      size: imageFile.size
    });
    
    // Check if we have a valid filepath
    if (!imageFile.filepath) {
      return res.status(400).json({ message: 'Invalid file upload - missing file path.' });
    }
    
    // Validate the mime type
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validMimeTypes.includes(imageFile.mimetype)) {
      return res.status(400).json({ 
        message: 'Invalid file type. Please upload a JPG, PNG, or GIF image.'
      });
    }

    // Read the image file
    const imageData = fs.readFileSync(imageFile.filepath);
    
    // Get grid size parameter
    const gridSize = parseInt(fields.gridSize || '50', 10);
    console.log("Using grid size:", gridSize);

    // Send the image to the backend service
    try {
      console.log("Sending request to backend...");
      
      // Create a multipart/form-data request that FastAPI expects
      const formData = new FormData();
      formData.append('image', imageData, {
        filename: imageFile.originalFilename || 'image.png',
        contentType: imageFile.mimetype,
      });
      
      // Send using multipart/form-data format instead of raw binary
      const backendResponse = await axios.post(
        'http://localhost:5000/process-image', 
        formData, 
        {
          headers: {
            ...formData.getHeaders(),
            'X-Grid-Size': gridSize.toString(),
          },
          // Remove timeout limit to allow processing to complete
          // timeout: 30000, // Removing this 30 second timeout
        }
      );

      console.log("Backend response received");
      // Add unique ID to the response
      const responseData = {
        ...backendResponse.data,
        id: Date.now().toString() // Simple ID for referencing the image
      };

      return res.status(200).json(responseData);
    } catch (error) {
      console.error('Backend processing error:', error);
      
      // Provide appropriate error messages based on the error
      if (error.response) {
        console.error('Backend error response:', error.response.data);
        // The request was made and the server responded with an error status
        return res.status(error.response.status).json({ 
          message: error.response.data.detail 
            ? (Array.isArray(error.response.data.detail) 
               ? error.response.data.detail[0]?.msg || 'Error processing image on server'
               : error.response.data.detail) 
            : 'Error processing image on server' 
        });
      } else if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({ message: 'Backend service unavailable. Please make sure the backend server is running.' });
      } else if (error.code === 'ETIMEDOUT') {
        return res.status(504).json({ message: 'Processing timed out. Try a smaller grid size.' });
      } else {
        return res.status(500).json({ message: `Failed to process image: ${error.message}` });
      }
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    
    // Handle formidable errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'Image too large. Maximum size is 10MB.' });
    }
    
    return res.status(500).json({ message: `Failed to process request: ${error.message}` });
  } finally {
    // Fix: Cleanup with proper array handling
    try {
      if (files && files.image) {
        const imageFiles = Array.isArray(files.image) ? files.image : [files.image];
        
        for (const file of imageFiles) {
          if (file && file.filepath) {
            fs.unlink(file.filepath, (err) => {
              if (err) console.error('Error removing temp file:', err);
            });
          }
        }
      }
    } catch (cleanupError) {
      console.error('Error during file cleanup:', cleanupError);
    }
  }
}
