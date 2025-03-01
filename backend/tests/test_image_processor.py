import pytest
from PIL import Image
import numpy as np
import os
import sys

# Add parent directory to path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.image_processor import process_image_to_blocks
from services.block_database import get_minecraft_blocks, find_closest_block

def test_get_minecraft_blocks():
    """Test that we can retrieve Minecraft blocks database"""
    blocks = get_minecraft_blocks()
    assert len(blocks) > 0
    assert "name" in blocks[0]
    assert "color" in blocks[0]

def test_find_closest_block():
    """Test the closest block finding functionality"""
    blocks = get_minecraft_blocks()
    
    # Test with exact color match
    block_name, block_color = find_closest_block(np.array([255, 0, 0]), blocks)
    assert block_name is not None
    
    # Test with some random color
    block_name, block_color = find_closest_block(np.array([120, 80, 40]), blocks)
    assert block_name is not None
    assert len(block_color) == 3

def test_process_small_image():
    """Test processing a small test image"""
    # Create a small test image
    img = Image.new('RGB', (10, 10), color=(73, 109, 137))
    
    processed_img, block_counts = process_image_to_blocks(img, max_width=10, max_height=10)
    
    # Check that we got expected results
    assert processed_img is not None
    assert isinstance(block_counts, dict)
    assert len(block_counts) >= 1  # At least one block type should be used
    assert processed_img.width == 10 * 4  # Should be scaled by 4
    assert processed_img.height == 10 * 4

if __name__ == "__main__":
    # Run tests if this file is executed directly
    pytest.main(["-xvs", __file__])
