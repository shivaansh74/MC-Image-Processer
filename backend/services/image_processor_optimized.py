from PIL import Image
import numpy as np
from sklearn.cluster import MiniBatchKMeans
import cv2
from typing import Dict, Tuple, List, Any, Optional
import io
import time
import threading
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
from functools import partial

from services.block_database import get_minecraft_blocks, find_closest_block
from middleware.cache import cached_image_processing

# Cache for color matching results
color_match_cache = {}
# Lock for thread-safe cache access
cache_lock = threading.Lock()

def preprocess_image(
    image: Image.Image, 
    max_width: int, 
    max_height: int
) -> np.ndarray:
    """
    Preprocess image for conversion to Minecraft blocks
    
    Args:
        image: PIL Image
        max_width: Maximum width in blocks
        max_height: Maximum height in blocks
        
    Returns:
        Numpy array with preprocessed image
    """
    # Resize image to fit within max dimensions while preserving aspect ratio
    width, height = image.size
    scale_factor = min(max_width / width, max_height / height)
    new_width = int(width * scale_factor)
    new_height = int(height * scale_factor)
    
    # Use LANCZOS for higher quality downscaling
    resized_image = image.resize((new_width, new_height), Image.LANCZOS)
    
    # Convert PIL image to numpy array for OpenCV processing
    np_image = np.array(resized_image)
    
    # Convert to RGB if image is in RGBA format
    if len(np_image.shape) == 3 and np_image.shape[2] == 4:
        # Extract alpha channel
        alpha = np_image[:, :, 3]
        
        # Create RGB image
        rgb_image = cv2.cvtColor(np_image, cv2.COLOR_RGBA2RGB)
        
        # Apply white background for transparent pixels
        mask = (alpha[:, :, np.newaxis] / 255.0)
        white_background = np.ones_like(rgb_image) * 255
        np_image = (rgb_image * mask + white_background * (1 - mask)).astype(np.uint8)
    elif len(np_image.shape) == 2:
        # Convert grayscale to RGB
        np_image = cv2.cvtColor(np_image, cv2.COLOR_GRAY2RGB)
    
    return np_image

def quantize_colors(np_image: np.ndarray, num_colors: int = 48) -> np.ndarray:
    """
    Reduce the number of colors using k-means clustering
    
    Args:
        np_image: Image as numpy array
        num_colors: Number of colors to reduce to
        
    Returns:
        Color-quantized image
    """
    # Reshape the image to a 2D array of pixels
    h, w, d = np_image.shape
    pixels = np_image.reshape(-1, d)
    
    # Use MiniBatchKMeans for faster clustering of large images
    kmeans = MiniBatchKMeans(n_clusters=num_colors, batch_size=1000, random_state=42)
    labels = kmeans.fit_predict(pixels)
    
    # Map each pixel to its corresponding centroid
    quantized = kmeans.cluster_centers_[labels].reshape(h, w, d).astype(np.uint8)
    return quantized

def match_block_color(pixel_color: np.ndarray, blocks: List[Dict[str, Any]]) -> Tuple[str, List[int]]:
    """
    Find the closest matching block for a given color with caching
    
    Args:
        pixel_color: RGB color value
        blocks: List of available Minecraft blocks
        
    Returns:
        Tuple of (block_name, block_color)
    """
    # Convert to tuple for cache lookup
    color_tuple = tuple(pixel_color)
    
    # Check cache first
    with cache_lock:
        if color_tuple in color_match_cache:
            return color_match_cache[color_tuple]
    
    min_distance = float('inf')
    closest_block = None
    closest_color = None
    
    for block in blocks:
        block_color = np.array(block['color'])
        
        # Optional: Consider transparency for matching strategy
        if block.get('is_transparent', False):
            # Give slightly less preference to transparent blocks
            distance = np.linalg.norm(pixel_color - block_color) * 1.2
        else:
            distance = np.linalg.norm(pixel_color - block_color)
        
        if distance < min_distance:
            min_distance = distance
            closest_block = block['name']
            closest_color = block['color']
    
    result = (closest_block, closest_color)
    
    # Store in cache
    with cache_lock:
        color_match_cache[color_tuple] = result
    
    return result

def process_image_region(
    region: Tuple[int, int, int, int], 
    quantized: np.ndarray, 
    blocks: List[Dict[str, Any]]
) -> Tuple[Dict[str, int], List[List[Tuple[str, List[int]]]]]:
    """
    Process a region of the image to match with Minecraft blocks
    
    Args:
        region: Region to process (start_y, end_y, start_x, end_x)
        quantized: Color-quantized image
        blocks: List of available Minecraft blocks
        
    Returns:
        Tuple of (block_counts, block_grid)
    """
    start_y, end_y, start_x, end_x = region
    local_block_counts = {}
    local_block_grid = []
    
    for y in range(start_y, end_y):
        block_row = []
        for x in range(start_x, end_x):
            pixel_color = quantized[y, x]
            block_name, block_color = match_block_color(pixel_color, blocks)
            
            # Update block count
            if block_name in local_block_counts:
                local_block_counts[block_name] += 1
            else:
                local_block_counts[block_name] = 1
                
            block_row.append((block_name, block_color))
        local_block_grid.append(block_row)
    
    return local_block_counts, local_block_grid

@cached_image_processing
def process_image_to_blocks(
    image_data: bytes,
    grid_size: int = 100,
    num_colors: int = 48,
    output_scale: int = 4
) -> Dict[str, Any]:
    """
    Process an image to convert it to Minecraft blocks
    
    Args:
        image_data: Raw image bytes
        grid_size: Maximum grid size in blocks (width or height)
        num_colors: Number of colors to reduce to
        output_scale: Scale factor for the output image
        
    Returns:
        Dictionary with image data and block statistics
    """
    start_time = time.time()
    
    # Load image from bytes
    image = Image.open(io.BytesIO(image_data))
    
    # Preprocess image
    np_image = preprocess_image(image, grid_size, grid_size)
    height, width = np_image.shape[:2]
    
    # Quantize colors
    quantized = quantize_colors(np_image, num_colors)
    
    # Get Minecraft blocks database
    minecraft_blocks = get_minecraft_blocks()
    
    # Divide image into regions for parallel processing
    num_cores = max(1, min(8, (os.cpu_count() or 4) - 1))
    regions = []
    
    # If the image is very small, process it directly
    if height * width < 5000:
        regions = [(0, height, 0, width)]
        use_parallel = False
    else:
        # Divide image vertically for parallel processing
        chunk_size = height // num_cores
        for i in range(num_cores):
            start_y = i * chunk_size
            end_y = height if i == num_cores - 1 else (i + 1) * chunk_size
            regions.append((start_y, end_y, 0, width))
        use_parallel = True
    
    # Process regions
    all_block_counts = {}
    all_block_grid = []
    
    if use_parallel:
        # Parallel processing for larger images
        with ThreadPoolExecutor(max_workers=num_cores) as executor:
            process_func = partial(process_image_region, quantized=quantized, blocks=minecraft_blocks)
            results = executor.map(process_func, regions)
            
            for local_block_counts, local_block_grid in results:
                # Merge block counts
                for block, count in local_block_counts.items():
                    if block in all_block_counts:
                        all_block_counts[block] += count
                    else:
                        all_block_counts[block] = count
                        
                # Merge block grid
                all_block_grid.extend(local_block_grid)
    else:
        # Direct processing for small images
        local_block_counts, all_block_grid = process_image_region(regions[0], quantized, minecraft_blocks)
        all_block_counts = local_block_counts
    
    # Create output image with block colors
    block_image = np.zeros((height * output_scale, width * output_scale, 3), dtype=np.uint8)
    
    for y in range(height):
        for x in range(width):
            block_name, block_color = all_block_grid[y][x - (0 if y == 0 else width)]
            
            # Draw block at scaled size
            y1, y2 = y * output_scale, (y + 1) * output_scale
            x1, x2 = x * output_scale, (x + 1) * output_scale
            
            block_image[y1:y2, x1:x2] = block_color
    
    # Enhance visibility of pixel boundaries (optional)
    if output_scale > 3:
        for y in range(height):
            for x in range(1, width):
                # Draw vertical grid lines
                block_image[y * output_scale:(y + 1) * output_scale, x * output_scale - 1] = [0, 0, 0]
        
        for y in range(1, height):
            # Draw horizontal grid lines
            block_image[y * output_scale - 1, :] = [0, 0, 0]
    
    # Convert to PIL image
    output_image = Image.fromarray(block_image)
    
    # Convert image to base64
    buffered = io.BytesIO()
    output_image.save(buffered, format="PNG", optimize=True)
    img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
    
    processing_time = time.time() - start_time
    
    return {
        "imageData": img_base64,
        "blockCount": all_block_counts,
        "gridSize": {"width": width, "height": height},
        "processingTime": round(processing_time, 2)
    }
