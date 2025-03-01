import pytest
from fastapi.testclient import TestClient
import os
import io
from PIL import Image
import base64
import json

# Add parent directory to path so we can import our modules
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint returns expected message"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
    assert "Welcome" in response.json()["message"]

def test_process_image_endpoint():
    """Test the image processing endpoint with a simple image"""
    # Create a small test image
    img = Image.new('RGB', (20, 20), color=(73, 109, 137))
    
    # Save image to bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    
    # Send image to API
    response = client.post(
        "/process-image",
        files={"image": ("test_image.png", img_bytes, "image/png")}
    )
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert "imageData" in data
    assert "blockCount" in data
    
    # Check that we got valid base64 image data
    try:
        image_data = data["imageData"]
        decoded = base64.b64decode(image_data)
        Image.open(io.BytesIO(decoded))  # Should not raise an error
    except Exception as e:
        pytest.fail(f"Failed to decode image data: {e}")

if __name__ == "__main__":
    # Run tests if this file is executed directly
    pytest.main(["-xvs", __file__])
