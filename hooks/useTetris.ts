import { useState, useCallback, useEffect } from 'react';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  GameStatus,
  SHAPES,
  TICK_RATE_MS,
} from '../constants';
import { Grid, Piece } from '../types';
import {
  checkCollision,
  createEmptyGrid,
  getRandomShapeId,
  rotateMatrix,
} from '../utils/gameUtils';
import { useInterval } from './useInterval';

export const useTetris = () => {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [activePiece, setActivePiece] = useState<Piece | null>(null);
  const [nextPieceId, setNextPieceId] = useState<number>(getRandomShapeId());
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [dropTime, setDropTime] = useState<number | null>(null);

  const startGame = useCallback(() => {
    setGrid(createEmptyGrid());
    setScore(0);
    const firstId = getRandomShapeId();
    const nextId = getRandomShapeId();
    setNextPieceId(nextId);
    
    // Spawn first piece
    setActivePiece({
      shapeId: firstId,
      matrix: SHAPES[firstId],
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0, 
    });
    
    setStatus(GameStatus.PLAYING);
    setDropTime(TICK_RATE_MS);
  }, []);

  const pauseGame = useCallback(() => {
    if (status === GameStatus.PLAYING) {
      setStatus(GameStatus.PAUSED);
      setDropTime(null);
    } else if (status === GameStatus.PAUSED) {
      setStatus(GameStatus.PLAYING);
      setDropTime(TICK_RATE_MS);
    }
  }, [status]);

  const move = useCallback((dir: number) => {
    if (!activePiece || status !== GameStatus.PLAYING) return;
    if (!checkCollision(activePiece, grid, dir, 0)) {
      setActivePiece((prev) => prev && { ...prev, x: prev.x + dir });
    }
  }, [activePiece, grid, status]);

  const rotate = useCallback(() => {
    if (!activePiece || status !== GameStatus.PLAYING) return;
    const rotated = rotateMatrix(activePiece.matrix);
    // Wall kick attempt: Try normal, then try shifting left, then right
    if (!checkCollision(activePiece, grid, 0, 0, rotated)) {
      setActivePiece((prev) => prev && { ...prev, matrix: rotated });
    } else if (!checkCollision(activePiece, grid, -1, 0, rotated)) {
       // Kick right wall
      setActivePiece((prev) => prev && { ...prev, matrix: rotated, x: prev.x - 1 });
    } else if (!checkCollision(activePiece, grid, 1, 0, rotated)) {
       // Kick left wall
      setActivePiece((prev) => prev && { ...prev, matrix: rotated, x: prev.x + 1 });
    }
  }, [activePiece, grid, status]);

  const drop = useCallback(() => {
    if (!activePiece || status !== GameStatus.PLAYING) return;

    // Check if we can move down
    if (!checkCollision(activePiece, grid, 0, 1)) {
      setActivePiece((prev) => prev && { ...prev, y: prev.y + 1 });
    } else {
      // Lock piece
      if (activePiece.y < 0) {
        setStatus(GameStatus.GAME_OVER);
        setDropTime(null);
        return;
      }
      
      const newGrid = grid.map((row) => [...row]);
      const { x, y, matrix, shapeId } = activePiece;

      // Imprint piece onto grid
      for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
          if (matrix[row][col] !== 0) {
            const gridY = y + row;
            const gridX = x + col;
            if (gridY >= 0 && gridY < BOARD_HEIGHT && gridX >= 0 && gridX < BOARD_WIDTH) {
              newGrid[gridY][gridX] = shapeId + 1; // +1 because 0 is empty
            }
          }
        }
      }

      // Check lines
      let linesCleared = 0;
      const sweptGrid = newGrid.reduce((acc, row) => {
        if (row.every((cell) => cell !== 0)) {
          linesCleared++;
          // Add empty row at top
          acc.unshift(Array(BOARD_WIDTH).fill(0));
        } else {
          acc.push(row);
        }
        return acc;
      }, [] as Grid);

      if (linesCleared > 0) {
        setScore((prev) => prev + linesCleared * 100 * linesCleared); // Exponential scoring
      }

      setGrid(sweptGrid);

      // Spawn next
      const nextPiece = {
        shapeId: nextPieceId,
        matrix: SHAPES[nextPieceId],
        x: Math.floor(BOARD_WIDTH / 2) - 1,
        y: 0,
      };

      // Immediate collision check on spawn (Game Over)
      if (checkCollision(nextPiece, sweptGrid)) {
        setStatus(GameStatus.GAME_OVER);
        setDropTime(null);
      } else {
        setActivePiece(nextPiece);
        setNextPieceId(getRandomShapeId());
      }
    }
  }, [activePiece, grid, nextPieceId, status]);

  const hardDrop = useCallback(() => {
     if (!activePiece || status !== GameStatus.PLAYING) return;
     let dropDist = 0;
     while(!checkCollision(activePiece, grid, 0, dropDist + 1)) {
        dropDist++;
     }
     // Apply the move immediately then force a lock on next tick roughly
     // Ideally we update state to the bottom and trigger logic, but iterating drop() is safer for now
     // To keep it simple in this hook: just set Y to max possible
     setActivePiece(prev => prev && ({...prev, y: prev.y + dropDist}));
     // We don't auto-lock here to allow a split second of "slide" or we can force it.
     // Let's force it by reducing drop time to 0 for one tick
     setDropTime(10); 
  }, [activePiece, grid, status]);

  useInterval(() => {
    drop();
    if (dropTime === 10) setDropTime(TICK_RATE_MS); // Reset after hard drop
  }, dropTime);

  return {
    grid,
    activePiece,
    score,
    status,
    nextPieceId,
    startGame,
    pauseGame,
    move,
    rotate,
    drop,
    hardDrop
  };
};
