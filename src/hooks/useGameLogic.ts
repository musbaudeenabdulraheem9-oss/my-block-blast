import { useState, useCallback, useEffect } from 'react';
import { Grid, BlockShape, Position, BLOCK_SHAPES, GRID_SIZE, CellState } from '@/lib/gameTypes';
import { soundManager } from '@/lib/sounds';

const createEmptyGrid = (): Grid => 
  Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));

const getRandomBlocks = (count: number): BlockShape[] => {
  const blocks: BlockShape[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * BLOCK_SHAPES.length);
    blocks.push({ ...BLOCK_SHAPES[randomIndex], id: `${BLOCK_SHAPES[randomIndex].id}-${Date.now()}-${i}` });
  }
  return blocks;
};

const canPlaceBlock = (grid: Grid, block: BlockShape, position: Position): boolean => {
  for (const cell of block.cells) {
    const newRow = position.row + cell.row;
    const newCol = position.col + cell.col;
    
    if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) {
      return false;
    }
    
    if (grid[newRow][newCol] !== 0) {
      return false;
    }
  }
  return true;
};

const canPlaceBlockAnywhere = (grid: Grid, block: BlockShape): boolean => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (canPlaceBlock(grid, block, { row, col })) {
        return true;
      }
    }
  }
  return false;
};

const checkGameOver = (grid: Grid, blocks: BlockShape[]): boolean => {
  return blocks.every(block => !canPlaceBlockAnywhere(grid, block));
};

export function useGameLogic() {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid);
  const [score, setScore] = useState(0);
  const [availableBlocks, setAvailableBlocks] = useState<BlockShape[]>(() => getRandomBlocks(3));
  const [isGameOver, setIsGameOver] = useState(false);
  const [clearingCells, setClearingCells] = useState<Position[]>([]);
  const [previewCells, setPreviewCells] = useState<Position[]>([]);

  const resetGame = useCallback(() => {
    setGrid(createEmptyGrid());
    setScore(0);
    setAvailableBlocks(getRandomBlocks(3));
    setIsGameOver(false);
    setClearingCells([]);
    setPreviewCells([]);
  }, []);

  const updatePreview = useCallback((block: BlockShape | null, position: Position | null) => {
    if (!block || !position || !canPlaceBlock(grid, block, position)) {
      setPreviewCells([]);
      return;
    }
    
    const preview: Position[] = block.cells.map(cell => ({
      row: position.row + cell.row,
      col: position.col + cell.col,
    }));
    setPreviewCells(preview);
  }, [grid]);

  const clearPreview = useCallback(() => {
    setPreviewCells([]);
  }, []);

  const placeBlock = useCallback((blockId: string, position: Position) => {
    const block = availableBlocks.find(b => b.id === blockId);
    if (!block) return false;
    
    if (!canPlaceBlock(grid, block, position)) return false;
    
    // Place the block
    const newGrid = grid.map(row => [...row]);
    for (const cell of block.cells) {
      newGrid[position.row + cell.row][position.col + cell.col] = 1;
    }
    
    soundManager.playPlace();
    
    // Check for completed rows and columns
    const rowsToClear: number[] = [];
    const colsToClear: number[] = [];
    
    for (let row = 0; row < GRID_SIZE; row++) {
      if (newGrid[row].every(cell => cell === 1)) {
        rowsToClear.push(row);
      }
    }
    
    for (let col = 0; col < GRID_SIZE; col++) {
      if (newGrid.every(row => row[col] === 1)) {
        colsToClear.push(col);
      }
    }
    
    // Calculate score
    let scoreIncrease = block.cells.length;
    const linesCleared = rowsToClear.length + colsToClear.length;
    if (linesCleared > 0) {
      scoreIncrease += linesCleared * 10 + (linesCleared > 1 ? (linesCleared - 1) * 5 : 0);
    }
    
    // Mark cells for clearing animation
    const cellsToClear: Position[] = [];
    for (const row of rowsToClear) {
      for (let col = 0; col < GRID_SIZE; col++) {
        cellsToClear.push({ row, col });
      }
    }
    for (const col of colsToClear) {
      for (let row = 0; row < GRID_SIZE; row++) {
        if (!rowsToClear.includes(row)) {
          cellsToClear.push({ row, col });
        }
      }
    }
    
    if (cellsToClear.length > 0) {
      soundManager.playClear();
      
      // Mark as clearing
      for (const cell of cellsToClear) {
        newGrid[cell.row][cell.col] = 2;
      }
      setGrid(newGrid);
      setClearingCells(cellsToClear);
      
      // After animation, clear the cells
      setTimeout(() => {
        const clearedGrid = newGrid.map(row => 
          row.map(cell => (cell === 2 ? 0 : cell) as CellState)
        );
        setGrid(clearedGrid);
        setClearingCells([]);
        
        // Remove used block and check for refill
        const newBlocks = availableBlocks.filter(b => b.id !== blockId);
        if (newBlocks.length === 0) {
          const refilled = getRandomBlocks(3);
          setAvailableBlocks(refilled);
          if (checkGameOver(clearedGrid, refilled)) {
            setIsGameOver(true);
            soundManager.playGameOver();
          }
        } else {
          setAvailableBlocks(newBlocks);
          if (checkGameOver(clearedGrid, newBlocks)) {
            setIsGameOver(true);
            soundManager.playGameOver();
          }
        }
      }, 400);
    } else {
      setGrid(newGrid);
      
      // Remove used block and check for refill
      const newBlocks = availableBlocks.filter(b => b.id !== blockId);
      if (newBlocks.length === 0) {
        const refilled = getRandomBlocks(3);
        setAvailableBlocks(refilled);
        if (checkGameOver(newGrid, refilled)) {
          setIsGameOver(true);
          soundManager.playGameOver();
        }
      } else {
        setAvailableBlocks(newBlocks);
        if (checkGameOver(newGrid, newBlocks)) {
          setIsGameOver(true);
          soundManager.playGameOver();
        }
      }
    }
    
    setScore(prev => prev + scoreIncrease);
    setPreviewCells([]);
    return true;
  }, [grid, availableBlocks]);

  const getValidPosition = useCallback((block: BlockShape, position: Position): boolean => {
    return canPlaceBlock(grid, block, position);
  }, [grid]);

  return {
    grid,
    score,
    availableBlocks,
    isGameOver,
    clearingCells,
    previewCells,
    resetGame,
    placeBlock,
    updatePreview,
    clearPreview,
    getValidPosition,
  };
}
