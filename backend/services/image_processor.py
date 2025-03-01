from PIL import Image
import numpy as np
from sklearn.cluster import KMeans
import cv2
from typing import Dict, Tuple, List, Any
import io

from services.block_database import get_minecraft_blocks, find_closest_block

def process_image_to_blocks(
    image: Image.Image, 
    max_width: int = 100, 
    max_height: int = 100
) -> Tuple[Image.Image, Dict[str, int], List[List[Dict[str, Any]]]]:
    """
    Process an image to convert it to Minecraft blocks
    
    Args:
        image: PIL Image object
        max_width: Maximum width in blocks
        max_height: Maximum height in blocks
        
    Returns:
        Tuple containing:
        - Processed image showing block representation
        - Dictionary counting the number of each block used
        - 2D grid of block positions with name and color
    """
    # Resize image to fit within max dimensions while preserving aspect ratio
    width, height = image.size
    scale_factor = min(max_width / width, max_height / height)
    new_width = int(width * scale_factor)
    new_height = int(height * scale_factor)
    resized_image = image.resize((new_width, new_height), Image.LANCZOS)
    
    # Convert PIL image to numpy array for OpenCV processing
    np_image = np.array(resized_image)
    
    # Convert to RGB if image is in RGBA format
    if len(np_image.shape) == 3 and np_image.shape[2] == 4:
        np_image = cv2.cvtColor(np_image, cv2.COLOR_RGBA2RGB)
    
    # Apply k-means clustering for color quantization
    pixels = np_image.reshape(-1, 3)
    
    # Enhanced color quantization based on image size
    if new_width * new_height > 10000:
        # Large images - use standard clustering
        kmeans = KMeans(n_clusters=32, random_state=42, n_init=10)
        kmeans.fit(pixels)
        labels = kmeans.labels_
        centers = kmeans.cluster_centers_.astype(int)
        quantized = centers[labels].reshape(np_image.shape).astype(np.uint8)
    elif new_width * new_height > 2500:
        # Medium images - use fewer colors to maintain detail
        kmeans = KMeans(n_clusters=24, random_state=42, n_init=10)
        kmeans.fit(pixels)
        labels = kmeans.labels_
        centers = kmeans.cluster_centers_.astype(int)
        quantized = centers[labels].reshape(np_image.shape).astype(np.uint8)
    else:
        # Small images - preserve more original colors
        # Apply bilateral filter to smooth while preserving edges
        smoothed = cv2.bilateralFilter(np_image, 9, 75, 75)
        # Apply slight sharpening to maintain important details
        kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
        sharpened = cv2.filter2D(smoothed, -1, kernel)
        quantized = sharpened
    
    # Get Minecraft blocks database
    minecraft_blocks = get_minecraft_blocks()
    
    # Create output image and track block grid
    block_grid = []
    block_counts = {}
    block_image = np.zeros((new_height, new_width, 3), dtype=np.uint8)
    
    for y in range(new_height):
        grid_row = []
        for x in range(new_width):
            pixel_color = quantized[y, x]
            # Find closest matching Minecraft block
            block_name, block_color = find_closest_block(pixel_color, minecraft_blocks)
            
            # Update block count
            if block_name in block_counts:
                block_counts[block_name] += 1
            else:
                block_counts[block_name] = 1
            
            # Set pixel to the block's color
            block_image[y, x] = block_color
            
            # Add to block grid - FIX: Ensure block_color is properly converted to list
            # Check if block_color is already a list, if not convert using tolist()
            color_list = block_color if isinstance(block_color, list) else (
                block_color.tolist() if hasattr(block_color, 'tolist') else [int(c) for c in block_color]
            )
            
            grid_row.append({
                "name": block_name,
                "color": color_list  # This ensures we always have a proper list
            })
        
        block_grid.append(grid_row)
    
    # Convert numpy array back to PIL Image
    processed_image = Image.fromarray(block_image)
    
    # Create a larger image with visible blocks
    scale = 4  # Scale factor for the final image
    large_image = Image.new('RGB', (new_width * scale, new_height * scale))
    
    for y in range(new_height):
        for x in range(new_width):
            # Get the color for this block position
            color = tuple(map(int, block_image[y, x]))
            # Draw a square for this block
            for i in range(scale):
                for j in range(scale):
                    large_image.putpixel((x * scale + i, y * scale + j), color)
                    
            # Add grid lines
            if scale > 2:
                for i in range(scale):
                    large_image.putpixel((x * scale + i, y * scale), (0, 0, 0))
                    large_image.putpixel((x * scale + i, (y+1) * scale - 1), (0, 0, 0))
                    large_image.putpixel((x * scale, y * scale + i), (0, 0, 0))
                    large_image.putpixel(((x+1) * scale - 1, y * scale + i), (0, 0, 0))
    
    return large_image, block_counts, block_grid

def create_schematic_file(
    block_grid: np.ndarray, 
    block_map: Dict[Tuple[int, int, int], str]
) -> bytes:
    """
    Create a .schematic file from the block grid
    
    Args:
        block_grid: numpy array with block colors
        block_map: mapping from color to block name
        
    Returns:
        Bytes containing the schematic file
    """
    try:
        import nbtlib
        from nbtlib.tag import Byte, Short, ByteArray, List as NBTList
        
        height, width, _ = block_grid.shape
        
        # Create NBT data structure for .schematic file
        schematic = nbtlib.File({
            '': nbtlib.Compound({
                'Width': Short(width),
                'Height': Short(1),  # Flat schematic (height=1)
                'Length': Short(height),
                'Materials': nbtlib.String('Alpha'),
                'Blocks': ByteArray([0] * (width * height)),
                'Data': ByteArray([0] * (width * height)),
                'Entities': NBTList([]),
                'TileEntities': NBTList([])
            })
        })
        
        # TODO: Fill in the block data based on the block_grid
        # This requires a mapping from block names to block IDs
        
        # Return the schematic file as bytes
        buffer = io.BytesIO()
        schematic.save(buffer)
        return buffer.getvalue()
    except ImportError:
        raise ImportError("nbtlib is required for schematic file creation")
