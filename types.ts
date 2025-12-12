export type Grid = number[][]; // 0 for empty, >0 for shape ID + 1

export type Shape = number[][];

export interface Piece {
  shapeId: number; // Index in SHAPES array
  matrix: Shape;   // The current rotation matrix
  x: number;       // Grid X position (top-left of matrix)
  y: number;       // Grid Y position (top-left of matrix)
}

export interface GameState {
  grid: Grid;
  activePiece: Piece | null;
  nextPieceId: number;
  score: number;
  lines: number;
  level: number;
  status: string; // GameStatus enum
}
