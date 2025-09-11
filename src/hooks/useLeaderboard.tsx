import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardEntry {
  nickname: string;
  balance: number;
  daily_income: number;
  created_at: string;
  player_type: 'player' | 'bot';
}

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      // Get real players
      const { data: players, error: playersError } = await supabase
        .from('profiles')
        .select('nickname, balance, daily_income, created_at')
        .eq('is_banned', false);
      
      if (playersError) throw playersError;
      
      // Get bot players
      const { data: bots, error: botsError } = await supabase
        .from('bot_players')
        .select('nickname, balance, daily_income, created_at');
      
      if (botsError) throw botsError;
      
      // Combine and sort by balance
      const combined: LeaderboardEntry[] = [
        ...(players?.map(p => ({ ...p, player_type: 'player' as const })) || []),
        ...(bots?.map(b => ({ ...b, player_type: 'bot' as const })) || [])
      ];
      
      combined.sort((a, b) => Number(b.balance) - Number(a.balance));
      
      setLeaderboard(combined);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlayerRank = (playerNickname: string): number => {
    const position = leaderboard.findIndex(player => player.nickname === playerNickname);
    return position !== -1 ? position + 1 : 0;
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return { leaderboard, loading, refetch: fetchLeaderboard, getPlayerRank };
};