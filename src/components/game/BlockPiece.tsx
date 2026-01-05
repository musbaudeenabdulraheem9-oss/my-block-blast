import { BlockShape, Position } from '@/lib/gameTypes';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';

interface BlockPieceProps {
  block: BlockShape;
  onDragStart: (block: BlockShape) => void;
  onDragEnd: (position: Position | null) => void;
}

export function BlockPiece({ block, onDragStart, onDragEnd }: BlockPieceProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [touchPosition, setTouchPosition] = useState<{ x: number; y: number } | null>(null);
  const pieceRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);

  // Calculate grid dimensions for this block
  const maxRow = Math.max(...block.cells.map(c => c.row)) + 1;
  const maxCol = Math.max(...block.cells.map(c => c.col)) + 1;

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(block);
    
    // Create custom drag image
    const dragImage = document.createElement('div');
    dragImage.style.opacity = '0';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    setIsDragging(true);
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
    onDragStart(block);
    
    // Create ghost element
    if (pieceRef.current) {
      const ghost = pieceRef.current.cloneNode(true) as HTMLDivElement;
      ghost.style.position = 'fixed';
      ghost.style.pointerEvents = 'none';
      ghost.style.zIndex = '1000';
      ghost.style.opacity = '0.9';
      ghost.style.transform = 'scale(1.1)';
      document.body.appendChild(ghost);
      ghostRef.current = ghost;
      updateGhostPosition(touch.clientX, touch.clientY);
    }
  };

  const updateGhostPosition = (x: number, y: number) => {
    if (ghostRef.current) {
      const rect = pieceRef.current?.getBoundingClientRect();
      const width = rect?.width || 60;
      const height = rect?.height || 60;
      ghostRef.current.style.left = `${x - width / 2}px`;
      ghostRef.current.style.top = `${y - height - 20}px`;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
    updateGhostPosition(touch.clientX, touch.clientY);
    
    // Find element under touch (offset upward so user can see)
    const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY - 80);
    if (elementUnderTouch) {
      const row = elementUnderTouch.getAttribute('data-row');
      const col = elementUnderTouch.getAttribute('data-col');
      if (row !== null && col !== null) {
        // Trigger drag over effect
        const event = new CustomEvent('touchdragover', { 
          detail: { row: parseInt(row), col: parseInt(col) } 
        });
        window.dispatchEvent(event);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    
    // Remove ghost
    if (ghostRef.current) {
      document.body.removeChild(ghostRef.current);
      ghostRef.current = null;
    }
    
    if (touchPosition) {
      // Find element under touch point (offset upward)
      const elementUnderTouch = document.elementFromPoint(touchPosition.x, touchPosition.y - 80);
      if (elementUnderTouch) {
        const row = elementUnderTouch.getAttribute('data-row');
        const col = elementUnderTouch.getAttribute('data-col');
        if (row !== null && col !== null) {
          onDragEnd({ row: parseInt(row), col: parseInt(col) });
        } else {
          onDragEnd(null);
        }
      } else {
        onDragEnd(null);
      }
    } else {
      onDragEnd(null);
    }
    
    setIsDragging(false);
    setTouchPosition(null);
  };

  return (
    <div
      ref={pieceRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={cn(
        "block-shape p-2 bg-secondary/50 rounded-lg cursor-grab active:cursor-grabbing",
        "hover:bg-secondary/70 transition-all duration-200",
        isDragging && "opacity-50 scale-95"
      )}
    >
      <div
        className="grid gap-[2px]"
        style={{
          gridTemplateColumns: `repeat(${maxCol}, 1fr)`,
          gridTemplateRows: `repeat(${maxRow}, 1fr)`,
        }}
      >
        {Array.from({ length: maxRow * maxCol }).map((_, index) => {
          const row = Math.floor(index / maxCol);
          const col = index % maxCol;
          const isFilled = block.cells.some(c => c.row === row && c.col === col);
          
          return (
            <div
              key={index}
              className={cn(
                "w-5 h-5 sm:w-6 sm:h-6 rounded-sm transition-all",
                isFilled ? "bg-primary neon-glow" : "bg-transparent"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
