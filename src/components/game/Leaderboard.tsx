import { getLeaderboard } from '@/lib/leaderboard';
import { Trophy } from 'lucide-react';

export function Leaderboard() {
  const entries = getLeaderboard();

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground">No scores yet</p>
        <p className="text-sm text-muted-foreground/70">Play a game to get on the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <div
          key={`${entry.name}-${entry.date}`}
          className={`flex items-center justify-between p-3 rounded-lg ${
            index === 0 
              ? 'bg-primary/20 border border-primary/30' 
              : 'bg-secondary/50'
          }`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-center gap-3">
            <span className={`font-display font-bold w-6 text-center ${
              index === 0 ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {index + 1}
            </span>
            <span className="font-medium truncate max-w-[120px]">
              {entry.name}
            </span>
          </div>
          <span className={`font-display font-semibold ${
            index === 0 ? 'text-primary neon-text' : 'text-foreground'
          }`}>
            {entry.score.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
