import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaderboard } from '@/components/game/Leaderboard';
import { soundManager } from '@/lib/sounds';
import { Play, Trophy, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handlePlay = () => {
    soundManager.playClick();
    navigate('/game');
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundManager.setEnabled(newState);
    if (newState) soundManager.playClick();
  };

  const toggleLeaderboard = () => {
    soundManager.playClick();
    setShowLeaderboard(!showLeaderboard);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>
      
      {/* Sound toggle */}
      <button
        onClick={toggleSound}
        className="absolute top-4 right-4 p-3 text-muted-foreground hover:text-primary transition-colors"
        aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
      >
        {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      <div className="text-center z-10 animate-fade-in">
        {/* Logo / Title */}
        <div className="mb-8">
          <h1 className="text-5xl sm:text-7xl font-display font-black text-primary neon-text mb-2 float-animation">
            BLOCK
          </h1>
          <h1 className="text-5xl sm:text-7xl font-display font-black text-foreground">
            BLAST
          </h1>
        </div>
        
        <p className="text-muted-foreground mb-12 max-w-xs mx-auto">
          Drag blocks onto the grid. Clear rows and columns to score!
        </p>

        {/* Play Button */}
        <Button
          onClick={handlePlay}
          size="lg"
          className="px-12 py-6 text-xl font-display font-bold pulse-glow mb-6"
        >
          <Play className="mr-2 h-6 w-6" fill="currentColor" />
          PLAY
        </Button>

        {/* Leaderboard Toggle */}
        <div className="mt-8">
          <button
            onClick={toggleLeaderboard}
            className="flex items-center gap-2 mx-auto text-muted-foreground hover:text-primary transition-colors"
          >
            <Trophy size={20} />
            <span className="font-medium">Leaderboard</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Panel */}
      {showLeaderboard && (
        <div 
          className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={toggleLeaderboard}
        >
          <div 
            className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full neon-border animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-display font-bold">Leaderboard</h2>
            </div>
            
            <Leaderboard />
            
            <Button 
              onClick={toggleLeaderboard}
              variant="ghost"
              className="w-full mt-6"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="absolute bottom-4 text-xs text-muted-foreground/50">
        Touch or drag blocks to play
      </p>
    </div>
  );
}
