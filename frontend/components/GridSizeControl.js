import { useState } from 'react';

export default function GridSizeControl({ defaultSize = 50, maxSize = 200, onChange }) {
  const [gridSize, setGridSize] = useState(defaultSize);

  const handleChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setGridSize(newSize);
    onChange(newSize);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label htmlFor="gridSize" className="font-medium text-gray-700">
          Grid Size: <span className="font-bold">{gridSize}×{gridSize}</span>
        </label>
        <span className="text-sm text-gray-500">Blocks</span>
      </div>
      
      <input
        id="gridSize"
        type="range"
        min="10"
        max={maxSize}
        value={gridSize}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>10</span>
        <span>{maxSize}</span>
      </div>
      
      <p className="text-xs text-gray-500 mt-1">
        Smaller grids process faster but have less detail. 
        Larger grids have more detail but may take longer to process.
      </p>
    </div>
  );
}
