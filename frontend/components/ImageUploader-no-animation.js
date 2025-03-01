import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { compressImage } from '../utils/imageProcessing';

export default function ImageUploader({ onProcessingStart, onProcessed, onError }) {
  // Same state variables as before
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [gridSize, setGridSize] = useState(50);
  const [initialGridSize, setInitialGridSize] = useState(50);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [canReprocess, setCanReprocess] = useState(false);
  const [processingStage, setProcessingStage] = useState("");

  // Same helper functions as before
  const getGridSizeQuality = () => {
    if (gridSize < 30) return "low";
    if (gridSize < 70) return "medium";
    return "high";
  };
  
  const getEstimatedTime = () => {
    if (gridSize < 30) return "< 10 seconds";
    if (gridSize < 70) return "10-30 seconds";
    if (gridSize < 100) return "30-60 seconds";
    return "1+ minutes";
  };

  // Same effects and handlers
  // ...existing useEffect, processImage, onDrop, handleReprocess functions...

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });

  // Grid quality feedback colors - no changes
  const qualityColors = {
    low: {
      text: "text-yellow-600", 
      bg: "bg-yellow-100", 
      border: "border-yellow-300",
      icon: "text-yellow-500"
    },
    medium: {
      text: "text-green-600", 
      bg: "bg-green-100", 
      border: "border-green-300",
      icon: "text-green-500"
    },
    high: {
      text: "text-blue-600", 
      bg: "bg-blue-100", 
      border: "border-blue-300",
      icon: "text-blue-500"
    }
  };
  
  const quality = getGridSizeQuality();

  // Non-animated version of the component
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-4 text-white">
          <h2 className="text-xl font-bold mb-2">Minecraft Block Art Generator</h2>
          <p className="text-sm opacity-80">Transform your images into Minecraft block masterpieces!</p>
        </div>
        
        <div className="space-y-2 bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <label htmlFor="gridSize" className="font-medium text-gray-700 flex items-center justify-between">
            <span>Grid Size: <span className="font-bold">{gridSize}×{gridSize}</span></span>
            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${qualityColors[quality].text} ${qualityColors[quality].bg} ${qualityColors[quality].border}`}>
              {quality === "low" && "Fast / Lower Detail"}
              {quality === "medium" && "Balanced"}
              {quality === "high" && "High Detail / Slower"}
            </div>
          </label>
          
          <input
            id="gridSize"
            type="range"
            min="10"
            max="150" 
            value={gridSize}
            onChange={(e) => setGridSize(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>10</span>
            <span>50</span>
            <span>100</span>
            <span>150</span>
          </div>
          
          <div className="mt-3 flex items-start space-x-2 bg-blue-50 p-3 rounded-md border border-blue-200">
            <div className={`mt-0.5 ${qualityColors[quality].icon}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-xs space-y-1">
              <p className="text-blue-800">Estimated processing time: <span className="font-semibold">{getEstimatedTime()}</span></p>
              <p className="text-blue-700">
                {quality === "low" && "Small grid sizes process quickly but may not capture image details accurately."}
                {quality === "medium" && "Balanced setting provides good detail with reasonable processing time."}
                {quality === "high" && "Large grid sizes provide more detail but will take longer to process."}
              </p>
            </div>
          </div>
          
          {/* Reprocess button */}
          {canReprocess && (
            <button
              onClick={handleReprocess}
              disabled={isProcessing}
              className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Reprocess with New Grid Size'
              )}
            </button>
          )}
        </div>
      </div>
      
      <div 
        {...getRootProps()} 
        className={`p-6 border-2 border-dashed rounded-lg cursor-pointer text-center transition-colors shadow-md
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 bg-white'}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <svg 
            className="mx-auto h-16 w-16 text-gray-400" 
            stroke="currentColor" 
            fill="none"
            viewBox="0 0 48 48" 
            aria-hidden="true"
          >
            <path 
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
          {isDragActive ? (
            <p className="text-blue-600 text-lg font-medium">
              Drop your image here
            </p>
          ) : (
            <p className="text-gray-500">
              Drag & drop an image here, or click to select a file
            </p>
          )}
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>

      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm shadow-md">
          <strong>Error: </strong> {uploadError}
        </div>
      )}

      {isCompressing && (
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 bg-white p-3 rounded-md shadow-md">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          <p>Optimizing image size...</p>
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-md border p-6">
          <div className="w-16 h-16 relative mb-4">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">
            Processing your image{gridSize > 100 ? " (this may take a while for large grid sizes)" : ""}...
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {gridSize > 100 ? "For large grid sizes, processing may take several minutes." : ""}
          </p>
        </div>
      )}

      {uploadedImage && (
        <div>
          <p className="mb-2 font-medium text-gray-700">Uploaded Image:</p>
          <div className="border rounded-lg p-2 bg-white shadow-sm">
            <img 
              src={uploadedImage} 
              alt="Uploaded" 
              className="max-h-64 mx-auto"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500 text-center">
            Will be processed as {gridSize}×{gridSize} blocks
          </p>
        </div>
      )}
    </div>
  );
}
