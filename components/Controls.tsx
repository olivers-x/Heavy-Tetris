import React from 'react';

interface ControlsProps {
  onLeft: () => void;
  onRight: () => void;
  onRotate: () => void;
  onDown: () => void;
  onDrop: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ onLeft, onRight, onRotate, onDown, onDrop }) => {
  const btnClass = "bg-gray-800 active:bg-gray-700 text-white p-4 rounded-xl shadow-lg border border-gray-700 select-none touch-manipulation flex items-center justify-center text-xl font-bold";

  return (
    <div className="grid grid-cols-4 gap-3 w-full max-w-xl mt-6 px-2">
      {/* Row 1 */}
      <button 
        className={`${btnClass} col-span-1`}
        onClick={onLeft}
        aria-label="Move Left"
      >
        ←
      </button>
      
      <button 
        className={`${btnClass} col-span-1`}
        onClick={onDown}
        aria-label="Soft Drop"
      >
        ↓
      </button>
      
      <button 
        className={`${btnClass} col-span-1`}
        onClick={onRight}
        aria-label="Move Right"
      >
        →
      </button>

      <button 
        className={`${btnClass} col-span-1 bg-blue-900 border-blue-800 active:bg-blue-800`}
        onClick={onRotate}
        aria-label="Rotate"
      >
        ↻
      </button>
      
      {/* Big Hard Drop Button */}
      <button 
        className={`${btnClass} col-span-4 mt-1 bg-red-900/50 border-red-900 active:bg-red-800/50 h-14`}
        onClick={onDrop}
        aria-label="Hard Drop"
      >
        HARD DROP ⤓
      </button>
    </div>
  );
};
