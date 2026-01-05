import { LeaderboardEntry } from './gameTypes';

const LEADERBOARD_KEY = 'blockblast_leaderboard';
const MAX_ENTRIES = 10;

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToLeaderboard(name: string, score: number): LeaderboardEntry[] {
  const entries = getLeaderboard();
  
  const newEntry: LeaderboardEntry = {
    name: name.trim() || 'Anonymous',
    score,
    date: new Date().toISOString(),
  };
  
  entries.push(newEntry);
  entries.sort((a, b) => b.score - a.score);
  
  const trimmedEntries = entries.slice(0, MAX_ENTRIES);
  
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmedEntries));
  
  return trimmedEntries;
}

export function isHighScore(score: number): boolean {
  const entries = getLeaderboard();
  if (entries.length < MAX_ENTRIES) return score > 0;
  return score > entries[entries.length - 1].score;
}

export function getHighScore(): number {
  const entries = getLeaderboard();
  return entries.length > 0 ? entries[0].score : 0;
}
