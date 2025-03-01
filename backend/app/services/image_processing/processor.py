import cv2
import numpy as np
from PIL import Image
from sklearn.cluster import KMeans
import os

# This would be expanded with actual block data
# Format: (Block name, (R, G, B))
MINECRAFT_BLOCKS = [
    ("stone", (128, 128, 128)),
    ("dirt", (134, 96, 67)),
    ("grass_block_side", (124, 168, 80)),
    ("oak_planks", (196, 160, 96)),
    ("white_wool", (224, 224, 224)),
    ("orange_wool", (234, 126, 53)),
    ("magenta_wool", (191, 75, 201)),
    ("light_blue_wool", (102, 153, 216)),
    ("yellow_wool", (249, 198, 39)),
    ("lime_wool", (112, 185, 25)),
    ("pink_wool", (237, 141, 172)),
    ("gray_wool", (63, 68, 71)),
    ("light_gray_wool", (142, 142, 134)),
    ("cyan_wool", (21, 137, 145)),
    ("purple_wool", (121, 42, 172)),
    ("blue_wool", (53, 57, 157)),
    ("brown_wool", (114, 71, 40)),
    ("green_wool", (84, 109, 27)),
    ("red_wool", (160, 39, 34)),
    ("black_wool", (20, 21, 25)),
    ("gold_block", (249, 236, 79)),
    ("iron_block", (220, 220, 220)),
    ("diamond_block", (116, 218, 255)),
    ("netherrack", (111, 54, 52)),
    ("white_concrete", (207, 213, 214)),
    ("orange_concrete", (224, 97, 0)),
    ("magenta_concrete", (169, 48, 159)),
    ("light_blue_concrete", (36, 137, 199)),
    ("yellow_concrete", (241, 175, 21)),
    ("lime_concrete", (94, 169, 24)),
    ("pink_concrete", (213, 101, 142)),
    ("gray_concrete", (54, 57, 61)),
    ("light_gray_concrete", (125, 125, 115)),
    ("cyan_concrete", (21, 119, 136)),
    ("purple_concrete", (100, 32, 156)),
    ("blue_concrete", (45, 47, 143)),
    ("brown_concrete", (96, 59, 31)),
    ("green_concrete", (73, 91, 36)),
    ("red_concrete", (142, 32, 32)),
    ("black_concrete", (8, 10, 15)),
]

# Directory with block textures (would need to be populated)
BLOCK_TEXTURES_DIR = "app/services/image_processing/block_textures"

def find_closest_block_color(pixel_rgb):
    """Find the Minecraft block with the closest RGB color match to a pixel."""
    min_distance = float('inf')
    closest_block = None
    
    for block_name, block_rgb in MINECRAFT_BLOCKS:
        # Calculate Euclidean distance between colors
        distance = sum((p - b) ** 2 for p, b in zip(pixel_rgb, block_rgb)) ** 0.5
        if distance < min_distance:
            min_distance = distance
            closest_block = (block_name, block_rgb)
    
    return closest_block

def process_image_to_minecraft_blocks(input_path, output_path, grid_size=64):
    """Process an image to convert it to Minecraft blocks."""
    # Read the image
    image = cv2.imread(input_path)
    
    # Convert from BGR to RGB (OpenCV uses BGR)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Resize to the target grid size
    height, width = image.shape[:2]
    aspect_ratio = width / height
    
    if width > height:
        new_width = grid_size
        new_height = int(grid_size / aspect_ratio)
    else:
        new_height = grid_size
        new_width = int(grid_size * aspect_ratio)
    
    resized_image = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)
    
    # Create a blank canvas for the output image
    # Each block will be represented as 16x16 pixels in the output
    output_image = np.zeros((new_height*16, new_width*16, 3), dtype=np.uint8)
    
    # Process each pixel and map it to a Minecraft block
    for y in range(new_height):
        for x in range(new_width):
            pixel_rgb = resized_image[y, x]
            
            # Find the closest Minecraft block color
            block_name, block_rgb = find_closest_block_color(pixel_rgb)
            
            # For now, use a solid color for the block
            # In a more advanced version, we'd load the block texture
            block_color = np.array(block_rgb, dtype=np.uint8)
            
            # Place the block in the output image
            output_image[y*16:(y+1)*16, x*16:(x+1)*16] = block_color
    
    # Save the processed image
    output_image_pil = Image.fromarray(output_image)
    output_image_pil.save(output_path)
    
    return output_path

# In a more advanced implementation, we would:
# 1. Load actual block textures instead of using solid colors
# 2. Use a more sophisticated color matching algorithm
# 3. Implement options to export as .schematic files
# 4. Add more block types for better color matching
