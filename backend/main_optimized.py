from fastapi import FastAPI, File, UploadFile, HTTPException, Header, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from PIL import Image
import io
import base64
import os
import time
from typing import Dict, Any, Optional, List
import uuid
from pathlib import Path

from services.image_processor_optimized import process_image_to_blocks
from models.response_models import ProcessedImageResponse

app = FastAPI(title="Minecraft Image Processor API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories for temporary storage
TEMP_DIR = Path("temp")
SCHEMATIC_DIR = TEMP_DIR / "schematics"
TEMP_DIR.mkdir(exist_ok=True)
SCHEMATIC_DIR.mkdir(exist_ok=True)

# Store processed results for later schematic generation
processed_results: Dict[str, Dict[str, Any]] = {}

# Maximum image dimensions
MAX_IMAGE_SIZE = 2000  # pixels (width or height)
MAX_GRID_SIZE = 200    # blocks

@app.get("/")
async def root():
    return {"message": "Welcome to Minecraft Image Processor API", "status": "active"}

@app.post("/process-image", response_model=ProcessedImageResponse)
async def process_image_endpoint(
    image: bytes = File(...),
    x_grid_size: Optional[str] = Header(None),
    x_original_filename: Optional[str] = Header(None),
    background_tasks: BackgroundTasks = None
):
    try:
        # Get grid size from header
        grid_size = int(x_grid_size) if x_grid_size else 100
        
        # Limit grid size for performance
        grid_size = min(grid_size, MAX_GRID_SIZE)
        
        # Validate image before processing
        try:
            img = Image.open(io.BytesIO(image))
            width, height = img.size
            
            # Check if image is too large
            if width > MAX_IMAGE_SIZE or height > MAX_IMAGE_SIZE:
                return JSONResponse(
                    status_code=400,
                    content={"message": f"Image dimensions too large. Maximum size is {MAX_IMAGE_SIZE}x{MAX_IMAGE_SIZE} pixels"}
                )
                
            # Check if image is empty
            if width == 0 or height == 0:
                return JSONResponse(
                    status_code=400,
                    content={"message": "Invalid image with zero dimensions"}
                )
        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={"message": f"Invalid image file: {str(e)}"}
            )
        
        # Process image
        start_time = time.time()
        
        # Use either direct function call or background task based on image size
        result_id = str(uuid.uuid4())
        result = process_image_to_blocks(image, grid_size=grid_size)
        
        # Add image ID to result and save for later reference
        result["id"] = result_id
        processed_results[result_id] = result
        
        # Clean up old results to prevent memory leaks
        background_tasks.add_task(cleanup_old_results)
        
        # Return the processed image data
        processing_time = time.time() - start_time
        print(f"Total processing time: {processing_time:.2f} seconds")
        
        return ProcessedImageResponse(
            imageData=result["imageData"],
            blockCount=result["blockCount"],
            id=result_id,
            processingTime=round(processing_time, 2),
            gridSize=result["gridSize"]
        )
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")

@app.get("/get-schematic/{image_id}")
async def get_schematic_endpoint(image_id: str):
    """Generate and return a schematic file for the processed image"""
    if image_id not in processed_results:
        raise HTTPException(status_code=404, detail="Image not found")
    
    try:
        from services.schematic_generator import create_schematic_file
        
        # Get the processed image data
        result = processed_results[image_id]
        
        # Create the schematic file
        schematic_data = create_schematic_file(result)
        
        # Return the schematic file
        return Response(
            content=schematic_data,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename=minecraft_art_{image_id}.schematic"}
        )
    except Exception as e:
        print(f"Error generating schematic: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate schematic file")

def cleanup_old_results():
    """Clean up old results to prevent memory leaks"""
    global processed_results
    
    # Keep only the 20 most recent results
    if len(processed_results) > 20:
        # Sort by timestamp and keep the newest 20
        sorted_results = sorted(
            processed_results.items(), 
            key=lambda x: x[1].get("timestamp", 0), 
            reverse=True
        )
        processed_results = dict(sorted_results[:20])

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "cached_results": len(processed_results)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
