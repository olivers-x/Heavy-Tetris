// Board Dimensions
// Width 18 to accommodate the wider/heavier shapes and provide a larger playground
export const BOARD_WIDTH = 18;
export const BOARD_HEIGHT = 26;

export const TICK_RATE_MS = 800;
export const TICK_FAST_MS = 50;

// Color Palette for shapes
export const COLORS = [
  'bg-gray-900',       // 0: Empty
  'bg-cyan-500',       // Shape 0
  'bg-orange-500',     // Shape 1
  'bg-purple-500',     // Shape 2
  'bg-green-500',      // Shape 3
  'bg-pink-500',       // Shape 4
  'bg-yellow-500',     // Shape 5
];

export const BORDER_COLORS = [
  'border-gray-800',
  'border-cyan-700',
  'border-orange-700',
  'border-purple-700',
  'border-green-700',
  'border-pink-700',
  'border-yellow-700',
];

/**
 * Shape Definitions based on Prompt:
 * 1 = Block, 0 = Empty
 */
export const SHAPES = [
  // 0:
  // #..
  // ##.
  // ###
  [
    [1, 0, 0],
    [1, 1, 0],
    [1, 1, 1],
  ],

  // 1:
  // ###
  // .#.
  // ###
  [
    [1, 1, 1],
    [0, 1, 0],
    [1, 1, 1],
  ],

  // 2:
  // ..#
  // ###
  // ###
  [
    [0, 0, 1],
    [1, 1, 1],
    [1, 1, 1],
  ],

  // 3:
  // #.#
  // ###
  // ##.
  [
    [1, 0, 1],
    [1, 1, 1],
    [1, 1, 0],
  ],

  // 4:
  // #..
  // ##.
  // .##
  [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ],

  // 5:
  // ###
  // #.#
  // #.#
  [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
];

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
}
