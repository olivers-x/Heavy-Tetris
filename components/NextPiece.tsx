import React from 'react';
import { COLORS, SHAPES, BORDER_COLORS } from '../constants';

interface NextPieceProps {
  shapeId: number;
}

export const NextPiece: React.FC<NextPieceProps> = ({ shapeId }) => {
  const shape = SHAPES[shapeId];

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg flex flex-col items-center justify-center w-full">
      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Next</h3>
      <div className="grid grid-rows-3 gap-[2px]">
        {shape.map((row, y) => (
          <div key={y} className="flex gap-[2px]">
            {row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`w-4 h-4 rounded-sm ${
                  cell ? `${COLORS[shapeId + 1]} ${BORDER_COLORS[shapeId + 1]} border-b-2 border-r-2` : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
