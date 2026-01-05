import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addToLeaderboard, isHighScore } from '@/lib/leaderboard';
import { soundManager } from '@/lib/sounds';

interface GameOverModalProps {
  score: number;
  onRestart: () => void;
  onHome: () => void;
}

export function GameOverModal({ score, onRestart, onHome }: GameOverModalProps) {
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);
  const showNameInput = isHighScore(score) && !saved;

  const handleSave = () => {
    if (name.trim()) {
      addToLeaderboard(name, score);
      setSaved(true);
      soundManager.playClick();
    }
  };

  const handleRestart = () => {
    if (showNameInput && name.trim()) {
      addToLeaderboard(name, score);
    }
    soundManager.playClick();
    onRestart();
  };

  const handleHome = () => {
    if (showNameInput && name.trim()) {
      addToLeaderboard(name, score);
    }
    soundManager.playClick();
    onHome();
  };

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center neon-border animate-scale-in">
        <h2 className="text-3xl font-display font-bold text-destructive mb-2">
          Game Over
        </h2>
        
        <p className="text-muted-foreground mb-4">Your score</p>
        
        <p className="text-5xl font-display font-bold text-primary neon-text mb-6">
          {score.toLocaleString()}
        </p>
        
        {showNameInput && (
          <div className="mb-6 space-y-3">
            <p className="text-sm text-primary">🎉 New High Score!</p>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              className="text-center bg-secondary border-border"
            />
            <Button 
              onClick={handleSave}
              variant="secondary"
              className="w-full"
              disabled={!name.trim()}
            >
              Save Score
            </Button>
          </div>
        )}
        
        {saved && (
          <p className="text-sm text-primary mb-6">✓ Score saved!</p>
        )}
        
        <div className="space-y-3">
          <Button 
            onClick={handleRestart}
            className="w-full font-display pulse-glow"
          >
            Play Again
          </Button>
          
          <Button 
            onClick={handleHome}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
          >
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
