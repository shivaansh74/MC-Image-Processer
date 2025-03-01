from pydantic import BaseModel
from typing import Dict, List, Any, Optional

class BlockPosition(BaseModel):
    name: str
    color: List[int]

class GridSize(BaseModel):
    width: int
    height: int

class ProcessedImageResponse(BaseModel):
    imageData: str  # Base64 encoded image
    blockCount: Dict[str, int]  # Count of each Minecraft block used
    id: Optional[str] = None  # Unique ID for the processed image
    processingTime: Optional[float] = None  # Time taken to process in seconds
    gridSize: Optional[GridSize] = None  # Grid dimensions
    blockGrid: Optional[List[List[BlockPosition]]] = None  # 2D grid of blocks
