import { useState } from 'react';
import { formatBlockData } from '../utils/imageProcessing';
import ZoomableCanvas from './ZoomableCanvas';

export default function ImagePreview({ processedImage, loading, error }) {
  const [showStats, setShowStats] = useState(true);
  const [selectedDownload, setSelectedDownload] = useState('image');
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Processing Error</span>
        </div>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 border rounded-lg bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-500">Processing your image...</p>
        <p className="text-sm text-gray-400 mt-2">This may take a few moments</p>
      </div>
    );
  }

  if (!processedImage) {
    return (
      <div className="border rounded-lg p-8 text-center text-gray-500 h-64 flex flex-col items-center justify-center bg-gray-50">
        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p>Processed image will appear here</p>
        <p className="text-sm mt-2">Upload an image to start</p>
      </div>
    );
  }

  // Format block data for display
  const blockData = processedImage.blockCount ? 
    formatBlockData(processedImage.blockCount).slice(0, 20) : [];

  // Prepare block grid data for the zoomable canvas
  const blockGrid = processedImage.blockGrid || [];
  const gridWidth = processedImage.gridSize?.width || 0;
  const gridHeight = processedImage.gridSize?.height || 0;

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Block view using ZoomableCanvas */}
      <div className="bg-gray-50 p-3 border-b">
        <h3 className="text-center font-medium text-gray-700">
          Minecraft Block View
        </h3>
      </div>
      
      <div>
        <ZoomableCanvas 
          imageData={processedImage.imageData}
          blockGrid={blockGrid}
          width={gridWidth}
          height={gridHeight}
        />
      </div>
      
      {/* Processing time display */}
      {processedImage.processingTime && (
        <div className="bg-gray-50 py-1 px-3 text-xs text-gray-500 text-right border-t">
          Processing time: {processedImage.processingTime}s
        </div>
      )}
      
      {/* Toggle stats button */}
      <div className="p-4 border-t border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setShowStats(!showStats)}
            className="text-sm flex items-center text-gray-700 hover:text-blue-600 font-medium"
          >
            <span>{showStats ? 'Hide' : 'Show'} Block Statistics</span>
            <svg 
              className={`w-5 h-5 ml-1 transform transition-transform ${showStats ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <span className="text-xs text-gray-500">
            {Object.values(processedImage.blockCount || {}).reduce((sum, count) => sum + count, 0)} blocks total
          </span>
        </div>
      </div>
      
      {/* Block statistics */}
      {showStats && processedImage.blockCount && (
        <div className="p-4 bg-white">
          <h3 className="font-medium mb-3 text-gray-700">Most Used Blocks</h3>
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left py-2 px-3">Block</th>
                  <th className="text-right py-2 px-3">Count</th>
                  <th className="text-right py-2 px-3">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {blockData.map(({ block, count, percentage }) => (
                  <tr key={block} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-3">{block}</td>
                    <td className="py-2 px-3 text-right font-mono">{count}</td>
                    <td className="py-2 px-3 text-right">{percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {blockData.length >= 20 && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Showing top 20 blocks only
              </p>
            )}
          </div>
        </div>
      )}

      {/* Download options */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="mb-3">
          <div className="flex text-sm space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="downloadType"
                value="image"
                checked={selectedDownload === 'image'}
                onChange={() => setSelectedDownload('image')}
                className="mr-2"
              />
              PNG Image
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="downloadType"
                value="schematic"
                checked={selectedDownload === 'schematic'}
                onChange={() => setSelectedDownload('schematic')}
                className="mr-2"
              />
              Schematic File
            </label>
          </div>
        </div>

        <a
          href={
            selectedDownload === 'image'
              ? `data:image/png;base64,${processedImage.imageData}`
              : `/api/download-schematic?imageId=${processedImage.id}`
          }
          download={selectedDownload === 'image' ? "minecraft-art.png" : "minecraft-art.schematic"}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors w-full text-center"
        >
          Download {selectedDownload === 'image' ? 'Image' : 'Schematic File'}
        </a>
      </div>
    </div>
  );
}
