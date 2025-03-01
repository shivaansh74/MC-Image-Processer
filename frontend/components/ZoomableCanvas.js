import { useRef, useState, useEffect, useCallback } from 'react';
import CanvasBlockRenderer from './CanvasBlockRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';

/**
 * Component for displaying a zoomable and pannable Minecraft block grid with high-quality textures
 */
export default function ZoomableCanvas({ 
  imageData, 
  blockGrid, 
  width, 
  height 
}) {
  const containerRef = useRef(null);
  // Initialize with a scale that fits the entire grid in the viewport
  const [scale, setScale] = useState(0.5); // Start with a lower zoom level
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [showZoomControls, setShowZoomControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [preFullscreenCoordMode, setPreFullscreenCoordMode] = useState(false);

  // Add refs for the tooltip and icon
  const tooltipRef = useRef(null);
  const tooltipButtonRef = useRef(null);

  // Define fitToView function with useCallback BEFORE it's used in any useEffect
  const fitToView = useCallback(() => {
    if (!containerRef.current || !width || !height) return;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Calculate scale to fit the entire grid
    const scaleX = containerWidth / (width * 16);
    const scaleY = containerHeight / (height * 16);
    const fitScale = Math.min(scaleX, scaleY) * 0.9; // 90% to add some margin
    
    // Animate to new scale and center position
    setScale(fitScale);
    setOffset({
      x: (containerWidth - width * 16 * fitScale) / 2,
      y: (containerHeight - height * 16 * fitScale) / 2,
    });
  }, [width, height]);

  // Calculate initial scale to fit the entire image
  useEffect(() => {
    if (!containerRef.current || !width || !height) return;
    
    // Use the fitToView function for the initial sizing
    fitToView();
  }, [width, height, fitToView]);

  // Handle fullscreen toggling
  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      // Remember current coordinates setting
      setPreFullscreenCoordMode(showCoordinates);
      
      // Enter fullscreen
      if (containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        await containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        await containerRef.current.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      
      // Reset view after exiting fullscreen
      setTimeout(fitToView, 100);
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenNow = Boolean(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.msFullscreenElement
      );
      
      setIsFullscreen(isFullscreenNow);
      
      // Auto-adjust image to fit fullscreen dimensions
      if (isFullscreenNow && containerRef.current) {
        // Wait a brief moment for the fullscreen transition to complete
        setTimeout(() => {
          fitToView();
        }, 100);
      } else {
        // Restore previous coordinates mode when exiting fullscreen
        setShowCoordinates(preFullscreenCoordMode);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, [preFullscreenCoordMode, fitToView]);

  // Handle zoom with mouse wheel
  const handleWheel = (e) => {
    e.preventDefault();
    
    // Calculate zoom factor
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.max(0.1, Math.min(30, scale * zoomFactor));
    
    if (newScale !== scale) {
      // Calculate mouse position relative to container
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Calculate new offsets to zoom toward mouse position
      const oldScale = scale;
      const newOffset = {
        x: offset.x - ((mouseX - offset.x) * (newScale / oldScale - 1)),
        y: offset.y - ((mouseY - offset.y) * (newScale / oldScale - 1))
      };
      
      setOffset(newOffset);
      setScale(newScale);
    }
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    });
  };
  
  // Handle mouse move for dragging and hover info
  const handleMouseMove = (e) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
    
    // Always show hover info when over a block
    if (blockGrid && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - offset.x;
      const mouseY = e.clientY - rect.top - offset.y;
      
      const blockSize = scale * 16;
      const blockX = Math.floor(mouseX / blockSize);
      const blockY = Math.floor(mouseY / blockSize);
      
      if (
        blockX >= 0 && blockX < width && 
        blockY >= 0 && blockY < height && 
        blockGrid[blockY] && blockGrid[blockY][blockX]
      ) {
        const block = blockGrid[blockY][blockX];
        setHoveredBlock({
          x: blockX,
          y: blockY,
          name: block.name,
          color: block.color,
          position: {
            left: offset.x + blockX * blockSize, 
            top: offset.y + blockY * blockSize - 30
          }
        });
      } else {
        setHoveredBlock(null);
      }
    }
  };
  
  // Toggle coordinate display
  const toggleCoordinates = () => {
    setShowCoordinates(!showCoordinates);
  };
  
  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoveredBlock(null);
  };

  // Add click outside handler for the tooltip
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if the click is outside both the tooltip and the button that toggles it
      if (showZoomControls &&
          tooltipRef.current && 
          !tooltipRef.current.contains(event.target) &&
          tooltipButtonRef.current &&
          !tooltipButtonRef.current.contains(event.target)) {
        setShowZoomControls(false);
      }
    }
    
    // Add event listener when tooltip is shown
    if (showZoomControls) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showZoomControls]);

  // Modify the toggleZoomControls function to just open the tooltip
  const toggleZoomControls = () => {
    setShowZoomControls(true);
  };

  return (
    <div className="relative w-full">
      <div className={classNames(
        "flex justify-between items-center mb-2 p-2 rounded",
        "mc-panel mc-stone-bg"
      )}>
        <div className="text-sm text-white flex items-center relative">
          <span className="bg-black bg-opacity-50 shadow-sm px-2 py-1 rounded-md border border-gray-700">
            Zoom: {Math.round(scale * 100) / 100}x
          </span>
          <div 
            ref={tooltipButtonRef}
            className="ml-2 text-yellow-300 cursor-pointer hover:text-yellow-200 transition-colors"
            onClick={toggleZoomControls}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <AnimatePresence>
            {showZoomControls && (
              <motion.div 
                ref={tooltipRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 top-8 bg-black bg-opacity-80 shadow-lg rounded-md p-3 z-20 border border-gray-700 text-white"
              >
                <p className="text-xs mb-2">
                  Use mouse wheel to zoom in and out. Click and drag to pan the view.
                </p>
                <p className="text-xs">
                  Hover over blocks to see their names.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex space-x-2">
          {/* Add a toggle button for showing coordinates */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleCoordinates}
            className={classNames(
              "px-2 py-1 rounded text-sm transition-colors mc-button",
              showCoordinates ? "primary" : ""
            )}
          >
            {showCoordinates ? 'Hide Coords' : 'Show Coords'}
          </motion.button>
          
          {/* Add fullscreen toggle button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFullscreen}
            className="flex items-center px-2 py-1 rounded text-sm mc-button"
          >
            {isFullscreen ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Exit Full
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
                Full Screen
              </>
            )}
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setScale(prev => Math.max(0.1, prev / 1.5));
              setOffset({ x: 0, y: 0 });
            }}
            className="mc-button"
          >
            Zoom Out
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fitToView}
            className="mc-button"
          >
            Fit to View
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setScale(prev => Math.min(30, prev * 1.5));
            }}
            className="mc-button"
          >
            Zoom In
          </motion.button>
        </div>
      </div>
      
      <motion.div 
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden border-2 border-black rounded-lg bg-[#333] cursor-move ${isFullscreen ? 'w-screen h-screen border-0' : ''}`}
        style={{ 
          height: isFullscreen ? '100vh' : '400px',
          backgroundImage: 'url(/images/dirt.png)',
          backgroundRepeat: 'repeat'
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Grid background pattern */}
        <div className="absolute inset-0 opacity-30"
             style={{ 
               backgroundImage: "url(/images/grid_pattern.png)", 
               backgroundSize: "50px", 
               backgroundRepeat: "repeat"
             }}></div>
        
        {blockGrid && blockGrid.length > 0 && (
          <CanvasBlockRenderer
            blockGrid={blockGrid}
            width={width}
            height={height}
            scale={scale}
            offset={offset}
          />
        )}
        
        {/* Enhanced block tooltip */}
        <AnimatePresence>
          {hoveredBlock && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute z-10 transform -translate-x-1/2"
              style={{ 
                left: hoveredBlock.position.left + (scale * 8), // Center on block
                top: hoveredBlock.position.top
              }}
            >
              <div className="bg-black bg-opacity-75 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-sm shadow-lg border border-gray-800">
                <div className="font-medium">{hoveredBlock.name}</div>
                {showCoordinates && (
                  <div className="text-xs text-gray-300 mt-1">
                    X: {hoveredBlock.x}, Y: {hoveredBlock.y}
                  </div>
                )}
              </div>
              <div className="w-0 h-0 mx-auto border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-black border-opacity-75"></div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Zoom indicator */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs border border-gray-700">
          {Math.round(scale * 100)}%
        </div>

        {/* Improved fullscreen controls - Maintain all controls in fullscreen mode */}
        {isFullscreen && (
          <div className="mc-fullscreen-controls">
            <div className="flex flex-col space-y-2">
              <button 
                onClick={toggleCoordinates}
                className={classNames(
                  "flex items-center px-2 py-1.5 rounded",
                  "text-white text-xs mc-button",
                  showCoordinates ? "primary" : ""
                )}
                title={showCoordinates ? "Hide Coordinates" : "Show Coordinates"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="ml-1">{showCoordinates ? "Hide" : "Show"}</span>
              </button>
              
              <button 
                onClick={toggleFullscreen}
                className="mc-button"
                title="Exit Fullscreen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <button 
                onClick={() => setScale(prev => Math.max(0.1, prev / 1.5))}
                className="mc-button"
                title="Zoom Out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6" />
                </svg>
              </button>
              
              <button 
                onClick={fitToView}
                className="mc-button"
                title="Fit to View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              </button>
              
              <button 
                onClick={() => setScale(prev => Math.min(30, prev * 1.5))}
                className="mc-button"
                title="Zoom In"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </motion.div>
      
      <p className="mt-2 text-xs text-white bg-black bg-opacity-50 p-2 rounded">
        Tip: Mouse over blocks to see their name{showCoordinates ? ' and coordinates' : ''}. Use mouse wheel to zoom, drag to pan around.
      </p>
    </div>
  );
}
