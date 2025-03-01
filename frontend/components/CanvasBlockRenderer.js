import { useRef, useEffect } from 'react';

/**
 * Renders Minecraft blocks using canvas for high-quality display
 */
export default function CanvasBlockRenderer({ 
  blockGrid, 
  width, 
  height, 
  scale, 
  offset 
}) {
  const canvasRef = useRef(null);

  // Draw the canvas when dependencies change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !blockGrid || !blockGrid.length) return;
    
    const ctx = canvas.getContext('2d', { alpha: false });
    
    // Set canvas dimensions
    canvas.width = width * scale * 16;
    canvas.height = height * scale * 16;
    
    // Clear canvas with a background color
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set rendering options for better pixel art
    ctx.imageSmoothingEnabled = false;
    
    // Draw all blocks at their positions
    for (let y = 0; y < blockGrid.length; y++) {
      const row = blockGrid[y];
      if (!row) continue;
      
      for (let x = 0; x < row.length; x++) {
        const block = row[x];
        if (!block) continue;
        
        const xPos = x * scale * 16;
        const yPos = y * scale * 16;
        
        // Draw the block color
        const blockColor = `rgb(${block.color.join(',')})`;
        ctx.fillStyle = blockColor;
        ctx.fillRect(xPos, yPos, scale * 16, scale * 16);
        
        // Add texture effects based on block type
        addBlockTexture(ctx, block.name, xPos, yPos, scale * 16);
        
        // Add subtle grid lines between blocks when zoomed in
        if (scale > 2) {
          ctx.strokeStyle = 'rgba(0,0,0,0.15)';
          ctx.lineWidth = 1;
          ctx.strokeRect(xPos, yPos, scale * 16, scale * 16);
        }
      }
    }
  }, [blockGrid, width, height, scale]);

  // Add texture effects to blocks based on type
  function addBlockTexture(ctx, blockName, x, y, size) {
    const lowerName = blockName.toLowerCase();
    
    // Get darker and lighter versions of current fill color
    const currentColor = ctx.fillStyle;
    
    // Stone-like blocks
    if (lowerName.includes('stone') || lowerName.includes('cobble') || lowerName.includes('deep') || lowerName.includes('andesite') ||
        lowerName.includes('diorite') || lowerName.includes('granite')) {
      // Add stone texture effect
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      for (let i = 0; i < 4; i++) {
        const spotX = x + Math.random() * size;
        const spotY = y + Math.random() * size;
        const spotSize = size * 0.1;
        ctx.beginPath();
        ctx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Wood blocks
    else if (lowerName.includes('planks') || lowerName.includes('log') || lowerName.includes('wood')) {
      // Add wood grain texture
      const isDarkWood = lowerName.includes('dark') || lowerName.includes('spruce') || lowerName.includes('crimson');
      ctx.fillStyle = isDarkWood ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.1)';
      
      const grainGap = size / 4;
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(x, y + i * grainGap, size, size / 16);
      }
      
      if (lowerName.includes('log')) {
        // Add log ring pattern
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size/4, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    
    // Wool blocks
    else if (lowerName.includes('wool')) {
      // Add wool texture with fuzzy pattern
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      
      for (let i = 0; i < 10; i++) {
        const spotX = x + Math.random() * size;
        const spotY = y + Math.random() * size;
        const spotSize = size * 0.05;
        ctx.beginPath();
        ctx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Concrete
    else if (lowerName.includes('concrete')) {
      // Add concrete texture (flat with slight noise)
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      
      for (let i = 0; i < 20; i++) {
        const spotX = x + Math.random() * size;
        const spotY = y + Math.random() * size;
        const spotSize = size * 0.02;
        ctx.beginPath();
        ctx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Terracotta
    else if (lowerName.includes('terracotta')) {
      // Add terracotta texture (wavy pattern)
      ctx.fillStyle = 'rgba(0,0,0,0.07)';
      
      for (let i = 0; i < 3; i++) {
        const yPos = y + (i * size / 3) + (size / 6);
        
        ctx.beginPath();
        ctx.moveTo(x, yPos);
        ctx.bezierCurveTo(
          x + size/4, yPos - size/10,
          x + size*3/4, yPos + size/10,
          x + size, yPos
        );
        ctx.stroke();
      }
    }
    
    // Glass blocks
    else if (lowerName.includes('glass')) {
      // Add glass texture (highlights and reflections)
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(x + size*0.1, y + size*0.1, size*0.3, size*0.3);
      
      // Add glass border
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = Math.max(1, size/16);
      ctx.strokeRect(x + size*0.05, y + size*0.05, size*0.9, size*0.9);
    }
    
    // Nether blocks
    else if (lowerName.includes('nether') || lowerName.includes('crimson') || lowerName.includes('warped') || 
             lowerName.includes('blackstone') || lowerName.includes('basalt')) {
      // Add nether texture (cracks)
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      
      // Random cracks
      for (let i = 0; i < 3; i++) {
        const startX = x + Math.random() * size;
        const startY = y + Math.random() * size;
        const endX = startX + (Math.random() - 0.5) * size/2;
        const endY = startY + (Math.random() - 0.5) * size/2;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }
    
    // Metal blocks
    else if (lowerName.includes('block') && 
            (lowerName.includes('iron') || lowerName.includes('gold') || 
             lowerName.includes('diamond') || lowerName.includes('emerald') || 
             lowerName.includes('copper') || lowerName.includes('netherite'))) {
      // Add metallic sheen
      const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
      gradient.addColorStop(0, 'rgba(255,255,255,0.2)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
      gradient.addColorStop(1, 'rgba(255,255,255,0.2)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, size, size);
      
      // Add beveled edge
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = Math.max(1, size/16);
      ctx.strokeRect(x + size*0.1, y + size*0.1, size*0.8, size*0.8);
    }
    
    // Leaves
    else if (lowerName.includes('leaves')) {
      // Add leaf texture (small dots and variations)
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      
      for (let i = 0; i < 15; i++) {
        const spotX = x + Math.random() * size;
        const spotY = y + Math.random() * size;
        const spotSize = size * 0.03;
        ctx.beginPath();
        ctx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Add highlight spots
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      for (let i = 0; i < 8; i++) {
        const spotX = x + Math.random() * size;
        const spotY = y + Math.random() * size;
        const spotSize = size * 0.02;
        ctx.beginPath();
        ctx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Default texture effect for other blocks
    else {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
      
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(x + 3, y + 3, size - 6, size - 6);
    }
    
    // Restore original fill color
    ctx.fillStyle = currentColor;
  }

  return (
    <canvas 
      ref={canvasRef}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        imageRendering: 'pixelated', // Make pixel art look sharp
        position: 'absolute'
      }}
    />
  );
}
