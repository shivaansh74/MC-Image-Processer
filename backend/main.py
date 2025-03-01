from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image
import io
import base64
import os
import uuid
import shutil
import time
from typing import Optional

from services.image_processor import process_image_to_blocks
from models.response_models import ProcessedImageResponse, GridSize
from app.services.image_processing.processor import process_image_to_minecraft_blocks

# Create output directory if it doesn't exist
os.makedirs("output", exist_ok=True)

app = FastAPI(title="Minecraft Block Image Converter API")

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://image2mc.vercel.app",  # Replace with your Vercel domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory
app.mount("/output", StaticFiles(directory="output"), name="output")

@app.get("/")
async def root():
    return {"status": "active", "message": "Minecraft Image Processor API"}

@app.post("/process-image", response_model=ProcessedImageResponse)
async def process_image_endpoint(
    image: bytes = File(...),
    x_grid_size: Optional[str] = Header(None)
):
    start_time = time.time()
    
    try:
        # Load image from bytes
        img = Image.open(io.BytesIO(image))
        
        # Get grid size from header or use default
        grid_size = int(x_grid_size) if x_grid_size else 50
        
        # Add a warning log for large grid sizes
        if grid_size > 100:
            print(f"Processing large grid size: {grid_size}. This may take a while.")
        
        # Process image
        processed_img, block_counts, block_grid = process_image_to_blocks(
            img, 
            max_width=grid_size, 
            max_height=grid_size
        )
        
        # Convert processed image to base64 for response
        buffered = io.BytesIO()
        processed_img.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        # Return processed image data and block counts
        return ProcessedImageResponse(
            imageData=img_base64,
            blockCount=block_counts,
            processingTime=round(processing_time, 2),
            gridSize=GridSize(
                width=len(block_grid[0]) if block_grid and block_grid[0] else 0,
                height=len(block_grid)
            ),
            blockGrid=block_grid
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("main:app", 
                host="0.0.0.0", 
                port=port,
                reload=True)
