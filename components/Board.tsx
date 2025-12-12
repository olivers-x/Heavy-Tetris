import React, { useMemo } from 'react';
import { Grid, Piece } from '../types';
import { COLORS, BORDER_COLORS } from '../constants';

interface BoardProps {
  grid: Grid;
  activePiece: Piece | null;
}

export const Board: React.FC<BoardProps> = ({ grid, activePiece }) => {
  // Combine static grid and active piece for rendering
  const displayGrid = useMemo(() => {
    // Clone grid to avoid mutation
    const renderGrid = grid.map((row) => [...row]);

    if (activePiece) {
      const { x, y, matrix, shapeId } = activePiece;
      for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
          if (matrix[row][col] !== 0) {
            const gridY = y + row;
            const gridX = x + col;
            if (gridY >= 0 && gridY < renderGrid.length && gridX >= 0 && gridX < renderGrid[0].length) {
              renderGrid[gridY][gridX] = shapeId + 1; // 1-based index for colors
            }
          }
        }
      }
    }
    return renderGrid;
  }, [grid, activePiece]);

  return (
    <div className="bg-gray-900 p-2 rounded-lg border-4 border-gray-700 shadow-2xl relative">
      <div 
        className="grid gap-[1px] bg-gray-800"
        style={{
          gridTemplateColumns: `repeat(${displayGrid[0].length}, minmax(0, 1fr))`,
        }}
      >
        {displayGrid.map((row, rowIndex) =>
          row.map((cellValue, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                aspect-square w-full rounded-[2px] transition-colors duration-75
                ${COLORS[cellValue]}
                ${cellValue !== 0 ? `border-b-4 border-r-4 ${BORDER_COLORS[cellValue]} shadow-inner` : ''}
                ${cellValue === 0 ? 'opacity-30' : 'opacity-100'}
              `}
            >
              {cellValue === 0 && (
                <div className="w-full h-full bg-white/5 rounded-sm" />
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Scanline effect overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 bg-[length:100%_4px,6px_100%] opacity-20"></div>
    </div>
  );
};
