export type CellState = 0 | 1 | 2; // 0 = empty, 1 = filled, 2 = clearing

export type Grid = CellState[][];

export interface Position {
  row: number;
  col: number;
}

export interface BlockShape {
  id: string;
  cells: Position[];
  color?: string;
}

export interface GameState {
  grid: Grid;
  score: number;
  availableBlocks: BlockShape[];
  isGameOver: boolean;
  clearingCells: Position[];
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

// Block shape definitions
export const BLOCK_SHAPES: BlockShape[] = [
  // Single block
  { id: 'single', cells: [{ row: 0, col: 0 }] },
  
  // Horizontal line (2)
  { id: 'line-h-2', cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }] },
  
  // Horizontal line (3)
  { id: 'line-h-3', cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }] },
  
  // Vertical line (2)
  { id: 'line-v-2', cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }] },
  
  // Vertical line (3)
  { id: 'line-v-3', cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }] },
  
  // Square (2x2)
  { id: 'square', cells: [
    { row: 0, col: 0 }, { row: 0, col: 1 },
    { row: 1, col: 0 }, { row: 1, col: 1 }
  ]},
  
  // L-shape
  { id: 'l-shape', cells: [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 1, col: 1 }
  ]},
  
  // Reverse L-shape
  { id: 'l-shape-rev', cells: [
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 1, col: 1 }
  ]},
  
  // T-shape
  { id: 't-shape', cells: [
    { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },
    { row: 1, col: 1 }
  ]},
  
  // Small corner
  { id: 'corner', cells: [
    { row: 0, col: 0 },
    { row: 1, col: 0 }, { row: 1, col: 1 }
  ]},
];

export const GRID_SIZE = 8;
