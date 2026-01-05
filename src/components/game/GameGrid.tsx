import { Grid, Position, GRID_SIZE } from '@/lib/gameTypes';
import { cn } from '@/lib/utils';

interface GameGridProps {
  grid: Grid;
  clearingCells: Position[];
  previewCells: Position[];
  onCellDrop: (position: Position) => void;
  onDragOver: (position: Position) => void;
  onDragLeave: () => void;
}

export function GameGrid({ 
  grid, 
  clearingCells, 
  previewCells,
  onCellDrop,
  onDragOver,
  onDragLeave,
}: GameGridProps) {
  const isCellClearing = (row: number, col: number) =>
    clearingCells.some(c => c.row === row && c.col === col);
  
  const isCellPreview = (row: number, col: number) =>
    previewCells.some(c => c.row === row && c.col === col);

  const handleDragOver = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    onDragOver({ row, col });
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    onCellDrop({ row, col });
  };

  const handleTouchEnd = (row: number, col: number) => {
    onCellDrop({ row, col });
  };

  return (
    <div 
      className="grid gap-[2px] p-2 bg-secondary/50 rounded-lg neon-border"
      style={{ 
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        aspectRatio: '1',
        maxWidth: '100%',
        width: 'min(85vw, 400px)',
      }}
      onDragLeave={onDragLeave}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              "grid-cell rounded-sm aspect-square transition-all duration-150",
              cell === 1 && "grid-cell-filled",
              cell === 2 && "clearing-animation",
              isCellPreview(rowIndex, colIndex) && "grid-cell-preview",
            )}
            onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
            onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
            data-row={rowIndex}
            data-col={colIndex}
          />
        ))
      )}
    </div>
  );
}
