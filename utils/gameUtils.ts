import { BOARD_HEIGHT, BOARD_WIDTH, SHAPES } from '../constants';
import { Grid, Piece, Shape } from '../types';

export const createEmptyGrid = (): Grid =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

export const getRandomShapeId = (): number => Math.floor(Math.random() * SHAPES.length);

export const rotateMatrix = (matrix: Shape): Shape => {
  // Transpose then reverse rows for 90 deg clockwise
  const N = matrix.length;
  const rotated = matrix.map((row, i) =>
    row.map((val, j) => matrix[N - 1 - j][i])
  );
  return rotated;
};

export const checkCollision = (
  piece: Piece,
  grid: Grid,
  moveX: number = 0,
  moveY: number = 0,
  newMatrix?: Shape
): boolean => {
  const matrix = newMatrix || piece.matrix;
  const { x, y } = piece;

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      // 1. Check if the block in the matrix is occupied
      if (matrix[row][col] !== 0) {
        const nextX = x + col + moveX;
        const nextY = y + row + moveY;

        // 2. Check Boundaries
        if (
          nextX < 0 ||
          nextX >= BOARD_WIDTH ||
          nextY >= BOARD_HEIGHT
        ) {
          return true;
        }

        // 3. Check if grid cell is already occupied (ignore if we are above the board - initial spawn)
        // We only check y >= 0 because shapes spawn partially off-screen sometimes, but collisions only matter inside board
        if (nextY >= 0 && grid[nextY][nextX] !== 0) {
          return true;
        }
      }
    }
  }
  return false;
};
