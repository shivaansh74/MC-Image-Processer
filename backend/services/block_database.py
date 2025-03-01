import json
import os
from typing import Dict, Tuple, List, Any
import numpy as np
import colorsys

# Define path to block database
DATABASE_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'minecraft_blocks.json')

def get_minecraft_blocks() -> List[Dict[str, Any]]:
    """
    Return a comprehensive list of Minecraft blocks with their colors
    
    Returns:
        List of blocks with name and RGB color values
    """
    return [
        # Stone blocks
        {"name": "Stone", "color": [125, 125, 125]},
        {"name": "Cobblestone", "color": [122, 122, 122]},
        {"name": "Andesite", "color": [136, 136, 136]},
        {"name": "Diorite", "color": [225, 223, 224]},
        {"name": "Granite", "color": [149, 103, 86]},
        {"name": "Polished Andesite", "color": [131, 131, 131]},
        {"name": "Polished Diorite", "color": [228, 228, 230]},
        {"name": "Polished Granite", "color": [153, 106, 89]},
        {"name": "Smooth Stone", "color": [160, 160, 160]},
        {"name": "Deepslate", "color": [70, 70, 70]},
        
        # Earth blocks
        {"name": "Dirt", "color": [134, 96, 67]},
        {"name": "Coarse Dirt", "color": [119, 85, 59]},
        {"name": "Podzol", "color": [123, 88, 57]},
        {"name": "Rooted Dirt", "color": [142, 107, 81]},
        {"name": "Mud", "color": [91, 76, 60]},
        {"name": "Grass Block", "color": [95, 159, 53]},
        {"name": "Mycelium", "color": [111, 99, 105]},
        
        # Sand blocks
        {"name": "Sand", "color": [219, 209, 160]},
        {"name": "Red Sand", "color": [194, 101, 38]},
        {"name": "Sandstone", "color": [217, 204, 158]},
        {"name": "Red Sandstone", "color": [181, 97, 31]},
        
        # Wood blocks
        {"name": "Oak Planks", "color": [162, 130, 78]},
        {"name": "Spruce Planks", "color": [104, 78, 47]},
        {"name": "Birch Planks", "color": [196, 179, 123]},
        {"name": "Jungle Planks", "color": [160, 114, 73]},
        {"name": "Acacia Planks", "color": [168, 90, 50]},
        {"name": "Dark Oak Planks", "color": [66, 43, 21]},
        {"name": "Mangrove Planks", "color": [117, 54, 42]},
        {"name": "Cherry Planks", "color": [242, 175, 173]},
        {"name": "Crimson Planks", "color": [148, 63, 78]},
        {"name": "Warped Planks", "color": [58, 142, 140]},
        {"name": "Oak Log", "color": [107, 84, 51]},
        {"name": "Spruce Log", "color": [58, 37, 16]},
        {"name": "Birch Log", "color": [217, 214, 188]},
        {"name": "Jungle Log", "color": [87, 68, 27]},
        {"name": "Acacia Log", "color": [105, 99, 89]},
        {"name": "Dark Oak Log", "color": [52, 40, 25]},
        {"name": "Mangrove Log", "color": [118, 56, 44]},
        {"name": "Cherry Log", "color": [196, 136, 125]},
        
        # Leaves
        {"name": "Oak Leaves", "color": [60, 192, 41]},
        {"name": "Spruce Leaves", "color": [30, 91, 18]},
        {"name": "Birch Leaves", "color": [128, 167, 85]},
        {"name": "Jungle Leaves", "color": [86, 177, 41]},
        {"name": "Acacia Leaves", "color": [64, 154, 36]},
        {"name": "Dark Oak Leaves", "color": [60, 135, 30]},
        {"name": "Mangrove Leaves", "color": [65, 171, 45]},
        {"name": "Cherry Leaves", "color": [242, 187, 231]},
        {"name": "Azalea Leaves", "color": [109, 154, 76]},
        {"name": "Flowering Azalea Leaves", "color": [151, 133, 108]},
        
        # Metal blocks
        {"name": "Iron Block", "color": [220, 220, 220]},
        {"name": "Gold Block", "color": [249, 236, 79]},
        {"name": "Diamond Block", "color": [98, 237, 228]},
        {"name": "Emerald Block", "color": [43, 205, 103]},
        {"name": "Lapis Block", "color": [39, 67, 138]},
        {"name": "Netherite Block", "color": [66, 61, 63]},
        {"name": "Redstone Block", "color": [219, 21, 0]},
        {"name": "Copper Block", "color": [192, 105, 84]},
        {"name": "Oxidized Copper", "color": [83, 138, 108]},
        {"name": "Raw Iron Block", "color": [183, 163, 148]},
        {"name": "Raw Gold Block", "color": [229, 172, 19]},
        {"name": "Raw Copper Block", "color": [180, 116, 89]},
        {"name": "Coal Block", "color": [19, 19, 19]},
        {"name": "Amethyst Block", "color": [135, 95, 182]},
        
        # Wool blocks - full spectrum
        {"name": "White Wool", "color": [233, 236, 236]},
        {"name": "Light Gray Wool", "color": [142, 142, 134]},
        {"name": "Gray Wool", "color": [62, 68, 71]},
        {"name": "Black Wool", "color": [20, 21, 25]},
        {"name": "Brown Wool", "color": [114, 71, 40]},
        {"name": "Red Wool", "color": [160, 39, 34]},
        {"name": "Orange Wool", "color": [240, 118, 19]},
        {"name": "Yellow Wool", "color": [248, 197, 39]},
        {"name": "Lime Wool", "color": [112, 185, 25]},
        {"name": "Green Wool", "color": [84, 109, 27]},
        {"name": "Cyan Wool", "color": [21, 137, 145]},
        {"name": "Light Blue Wool", "color": [58, 175, 217]},
        {"name": "Blue Wool", "color": [53, 57, 157]},
        {"name": "Purple Wool", "color": [121, 42, 172]},
        {"name": "Magenta Wool", "color": [189, 68, 179]},
        {"name": "Pink Wool", "color": [237, 141, 172]},
        
        # Terracotta - more subdued colors
        {"name": "Terracotta", "color": [152, 94, 67]},
        {"name": "White Terracotta", "color": [210, 178, 161]},
        {"name": "Light Gray Terracotta", "color": [135, 107, 98]},
        {"name": "Gray Terracotta", "color": [86, 65, 57]},
        {"name": "Black Terracotta", "color": [37, 22, 16]},
        {"name": "Brown Terracotta", "color": [77, 51, 35]},
        {"name": "Red Terracotta", "color": [143, 61, 46]},
        {"name": "Orange Terracotta", "color": [161, 83, 37]},
        {"name": "Yellow Terracotta", "color": [186, 133, 35]},
        {"name": "Lime Terracotta", "color": [103, 117, 52]},
        {"name": "Green Terracotta", "color": [76, 83, 42]},
        {"name": "Cyan Terracotta", "color": [86, 91, 91]},
        {"name": "Light Blue Terracotta", "color": [113, 108, 137]},
        {"name": "Blue Terracotta", "color": [74, 59, 91]},
        {"name": "Purple Terracotta", "color": [118, 69, 86]},
        {"name": "Magenta Terracotta", "color": [149, 88, 108]},
        {"name": "Pink Terracotta", "color": [161, 78, 78]},
        
        # Concrete - vibrant colors
        {"name": "White Concrete", "color": [207, 213, 214]},
        {"name": "Light Gray Concrete", "color": [125, 125, 115]},
        {"name": "Gray Concrete", "color": [54, 57, 61]},
        {"name": "Black Concrete", "color": [8, 10, 15]},
        {"name": "Brown Concrete", "color": [96, 59, 31]},
        {"name": "Red Concrete", "color": [142, 32, 32]},
        {"name": "Orange Concrete", "color": [224, 97, 0]},
        {"name": "Yellow Concrete", "color": [240, 175, 21]},
        {"name": "Lime Concrete", "color": [94, 168, 24]},
        {"name": "Green Concrete", "color": [73, 91, 36]},
        {"name": "Cyan Concrete", "color": [21, 119, 136]},
        {"name": "Light Blue Concrete", "color": [35, 137, 198]},
        {"name": "Blue Concrete", "color": [45, 47, 143]},
        {"name": "Purple Concrete", "color": [100, 31, 156]},
        {"name": "Magenta Concrete", "color": [169, 48, 159]},
        {"name": "Pink Concrete", "color": [213, 101, 142]},
        
        # Glass - transparent blocks
        {"name": "Glass", "color": [175, 213, 228], "is_transparent": True},
        {"name": "White Stained Glass", "color": [255, 255, 255], "is_transparent": True},
        {"name": "Light Gray Stained Glass", "color": [153, 153, 153], "is_transparent": True},
        {"name": "Gray Stained Glass", "color": [76, 76, 76], "is_transparent": True},
        {"name": "Black Stained Glass", "color": [25, 25, 25], "is_transparent": True},
        {"name": "Brown Stained Glass", "color": [102, 76, 51], "is_transparent": True},
        {"name": "Red Stained Glass", "color": [153, 51, 51], "is_transparent": True},
        {"name": "Orange Stained Glass", "color": [216, 127, 51], "is_transparent": True},
        {"name": "Yellow Stained Glass", "color": [229, 229, 51], "is_transparent": True},
        {"name": "Lime Stained Glass", "color": [127, 204, 25], "is_transparent": True},
        {"name": "Green Stained Glass", "color": [102, 127, 51], "is_transparent": True},
        {"name": "Cyan Stained Glass", "color": [76, 153, 178], "is_transparent": True},
        {"name": "Light Blue Stained Glass", "color": [102, 178, 216], "is_transparent": True},
        {"name": "Blue Stained Glass", "color": [51, 76, 178], "is_transparent": True},
        {"name": "Purple Stained Glass", "color": [127, 63, 178], "is_transparent": True},
        {"name": "Magenta Stained Glass", "color": [178, 76, 216], "is_transparent": True},
        {"name": "Pink Stained Glass", "color": [242, 127, 165], "is_transparent": True},
        
        # Special blocks
        {"name": "Sponge", "color": [207, 203, 80]},
        {"name": "Wet Sponge", "color": [171, 167, 69]},
        {"name": "Prismarine", "color": [99, 156, 151]},
        {"name": "Prismarine Bricks", "color": [99, 171, 158]},
        {"name": "Dark Prismarine", "color": [59, 87, 75]},
        {"name": "Sea Lantern", "color": [172, 199, 190]},
        {"name": "End Stone", "color": [221, 223, 165]},
        {"name": "End Stone Bricks", "color": [226, 231, 171]},
        {"name": "Purpur Block", "color": [169, 125, 169]},
        {"name": "Purpur Pillar", "color": [171, 129, 171]},
        {"name": "Honeycomb Block", "color": [227, 139, 36]},
        
        # Nether blocks
        {"name": "Netherrack", "color": [111, 54, 52]},
        {"name": "Nether Bricks", "color": [44, 21, 26]},
        {"name": "Red Nether Bricks", "color": [70, 8, 8]},
        {"name": "Warped Nylium", "color": [43, 104, 99]},
        {"name": "Crimson Nylium", "color": [130, 31, 31]},
        {"name": "Soul Sand", "color": [81, 62, 50]},
        {"name": "Soul Soil", "color": [73, 58, 47]},
        {"name": "Basalt", "color": [80, 81, 86]},
        {"name": "Blackstone", "color": [42, 35, 39]},
        {"name": "Gilded Blackstone", "color": [55, 42, 38]},
        {"name": "Magma Block", "color": [135, 65, 26]},
        {"name": "Glowstone", "color": [194, 153, 96]},
        {"name": "Shroomlight", "color": [240, 146, 70]},
        {"name": "Crying Obsidian", "color": [31, 21, 52]},
        {"name": "Obsidian", "color": [20, 18, 29]},
        
        # Coral blocks
        {"name": "Tube Coral Block", "color": [50, 91, 213]},
        {"name": "Brain Coral Block", "color": [202, 78, 157]},
        {"name": "Bubble Coral Block", "color": [220, 63, 197]},
        {"name": "Fire Coral Block", "color": [216, 71, 61]},
        {"name": "Horn Coral Block", "color": [227, 207, 73]},
    ]

def find_closest_block(target_color, blocks: List[Dict[str, Any]]) -> Tuple[str, List[int]]:
    """
    Find the closest matching Minecraft block for a given color using delta-E color distance
    
    Args:
        target_color: RGB color to match
        blocks: List of available Minecraft blocks
        
    Returns:
        Tuple of (block_name, block_color)
    """
    # Convert the target color to a Lab color space for better perceptual matching
    target_lab = rgb_to_lab(target_color)
    
    min_distance = float('inf')
    closest_block = None
    closest_color = None
    
    for block in blocks:
        block_color = block['color']
        block_lab = rgb_to_lab(block_color)
        
        # Calculate the delta E distance (perceptual color difference)
        # Using CIEDE2000 would be most accurate but more complex - CIE76 is simpler
        distance = delta_e_cie76(target_lab, block_lab)
        
        # Adjust distance based on block properties
        if block.get('is_transparent', False):
            distance *= 1.2  # Slightly avoid transparent blocks
        
        # Prefer natural blocks for more "Minecrafty" look
        if is_natural_block(block['name']):
            distance *= 0.9  # Give 10% preference to natural blocks
            
        if distance < min_distance:
            min_distance = distance
            closest_block = block['name']
            closest_color = block_color
    
    return closest_block, closest_color

def rgb_to_lab(rgb):
    """Convert RGB to Lab color space for better perceptual matching"""
    # First convert RGB to XYZ
    r, g, b = [x / 255.0 for x in rgb]
    
    # Convert sRGB to linear RGB
    r = r / 12.92 if r <= 0.04045 else ((r + 0.055) / 1.055) ** 2.4
    g = g / 12.92 if g <= 0.04045 else ((g + 0.055) / 1.055) ** 2.4
    b = b / 12.92 if b <= 0.04045 else ((b + 0.055) / 1.055) ** 2.4
    
    # Convert to XYZ using D65 white point
    x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375
    y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750
    z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041
    
    # Convert XYZ to Lab
    # Reference values for D65 white point
    xn, yn, zn = 0.95047, 1.0, 1.08883
    
    x = x / xn
    y = y / yn
    z = z / zn
    
    x = x ** (1/3) if x > 0.008856 else 7.787 * x + 16/116
    y = y ** (1/3) if y > 0.008856 else 7.787 * y + 16/116
    z = z ** (1/3) if z > 0.008856 else 7.787 * z + 16/116
    
    L = (116 * y) - 16
    a = 500 * (x - y)
    b = 200 * (y - z)
    
    return [L, a, b]

def delta_e_cie76(lab1, lab2):
    """Calculate the CIE76 Delta E (color difference) between two Lab colors"""
    L1, a1, b1 = lab1
    L2, a2, b2 = lab2
    
    # Simple Euclidean distance in Lab space
    delta_e = ((L2 - L1) ** 2 + (a2 - a1) ** 2 + (b2 - b1) ** 2) ** 0.5
    return delta_e

def is_natural_block(block_name):
    """Check if a block is considered 'natural' for biasing color matching"""
    natural_blocks = [
        'stone', 'dirt', 'grass', 'sand', 'gravel', 'log', 'leaves', 
        'wood', 'planks', 'clay', 'terracotta'
    ]
    
    block_name_lower = block_name.lower()
    return any(natural_term in block_name_lower for natural_term in natural_blocks)
