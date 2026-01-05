import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { GameGrid } from '@/components/game/GameGrid';
import { BlockTray } from '@/components/game/BlockTray';
import { ScoreDisplay } from '@/components/game/ScoreDisplay';
import { GameOverModal } from '@/components/game/GameOverModal';
import { useGameLogic } from '@/hooks/useGameLogic';
import { BlockShape, Position } from '@/lib/gameTypes';
import { soundManager } from '@/lib/sounds';
import { Button } from '@/components/ui/button';
import { Home, RotateCcw, Volume2, VolumeX } from 'lucide-react';

export default function Game() {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());
  const [draggedBlock, setDraggedBlock] = useState<BlockShape | null>(null);
  
  const {
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
  } = useGameLogic();

  const handleDragStart = useCallback((block: BlockShape) => {
    setDraggedBlock(block);
  }, []);

  const handleDragOver = useCallback((position: Position) => {
    if (draggedBlock) {
      updatePreview(draggedBlock, position);
    }
  }, [draggedBlock, updatePreview]);

  const handleDragEnd = useCallback((position: Position | null) => {
    if (draggedBlock && position) {
      placeBlock(draggedBlock.id, position);
    }
    setDraggedBlock(null);
    clearPreview();
  }, [draggedBlock, placeBlock, clearPreview]);

  const handleCellDrop = useCallback((position: Position) => {
    if (draggedBlock) {
      placeBlock(draggedBlock.id, position);
      setDraggedBlock(null);
      clearPreview();
    }
  }, [draggedBlock, placeBlock, clearPreview]);

  // Touch drag over listener
  useEffect(() => {
    const handleTouchDragOver = (e: CustomEvent<{ row: number; col: number }>) => {
      handleDragOver(e.detail);
    };
    
    window.addEventListener('touchdragover', handleTouchDragOver as EventListener);
    return () => {
      window.removeEventListener('touchdragover', handleTouchDragOver as EventListener);
    };
  }, [handleDragOver]);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundManager.setEnabled(newState);
    if (newState) soundManager.playClick();
  };

  const handleRestart = () => {
    soundManager.playClick();
    resetGame();
  };

  const handleHome = () => {
    soundManager.playClick();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col p-4 relative">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleHome}
          className="text-muted-foreground hover:text-foreground"
        >
          <Home size={24} />
        </Button>
        
        <ScoreDisplay score={score} />
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSound}
            className="text-muted-foreground hover:text-foreground"
          >
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRestart}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw size={24} />
          </Button>
        </div>
      </header>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <GameGrid
          grid={grid}
          clearingCells={clearingCells}
          previewCells={previewCells}
          onCellDrop={handleCellDrop}
          onDragOver={handleDragOver}
          onDragLeave={clearPreview}
        />
        
        <BlockTray
          blocks={availableBlocks}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      </div>

      {/* Instructions */}
      <p className="text-center text-xs text-muted-foreground/50 mt-4">
        Drag blocks to the grid • Fill rows or columns to clear them
      </p>

      {/* Game Over Modal */}
      {isGameOver && (
        <GameOverModal
          score={score}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}
    </div>
  );
}
