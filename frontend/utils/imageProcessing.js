/**
 * Converts a base64 string to a File object
 * @param {string} base64String - The base64 string representation of the image
 * @param {string} filename - The desired filename
 * @returns {File} A File object representing the image
 */
export function base64ToFile(base64String, filename) {
  const arr = base64String.split(',');
  const match = arr[0].match(/:(.*?);/);
  const mime = match ? match[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}

/**
 * Formats block count data for display
 * @param {Object} blockData - Object containing block counts
 * @returns {Array} Sorted array of block data for display
 */
export function formatBlockData(blockData) {
  if (!blockData) return [];
  
  return Object.entries(blockData)
    .sort((a, b) => b[1] - a[1]) // Sort by count (descending)
    .map(([block, count]) => ({
      block,
      count,
      percentage: ((count / Object.values(blockData).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
    }));
}

/**
 * Compresses an image to a specific size limit
 * @param {File} file - The image file to compress
 * @param {number} maxSizeKB - Max size in KB
 * @returns {Promise<File>} Compressed image file
 */
export function compressImage(file, maxSizeKB = 1024) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Maintain aspect ratio while resizing if needed
        if (width > 1200 || height > 1200) {
          const ratio = width / height;
          if (width > height) {
            width = 1200;
            height = Math.round(width / ratio);
          } else {
            height = 1200;
            width = Math.round(height * ratio);
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Try with decreasing quality until size is under limit
        let quality = 0.9;
        let output;
        
        while (quality > 0.1) {
          output = canvas.toDataURL('image/jpeg', quality);
          const testSize = Math.round((output.length * 3) / 4) / 1024; // Approximate KB size
          
          if (testSize <= maxSizeKB) {
            break;
          }
          
          quality -= 0.1;
        }
        
        resolve(base64ToFile(output, file.name));
      };
      
      img.onerror = (error) => {
        reject(error);
      };
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
  });
}
