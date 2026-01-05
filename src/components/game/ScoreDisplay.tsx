import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getHighScore } from '@/lib/leaderboard';

interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(score);
  const [isAnimating, setIsAnimating] = useState(false);
  const highScore = getHighScore();

  useEffect(() => {
    if (score !== displayScore) {
      setIsAnimating(true);
      setDisplayScore(score);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [score]);

  return (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Score</p>
        <p className={cn(
          "text-3xl sm:text-4xl font-display font-bold text-primary neon-text",
          isAnimating && "score-pop"
        )}>
          {displayScore.toLocaleString()}
        </p>
      </div>
      
      {highScore > 0 && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Best</p>
          <p className="text-xl sm:text-2xl font-display font-semibold text-muted-foreground">
            {highScore.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
