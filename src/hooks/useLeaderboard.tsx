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
      
      // Use the new security invoker function instead of view
      const { data, error } = await supabase
        .rpc('get_leaderboard');
      
      if (error) throw error;
      
      // Type the data correctly
      const typedData: LeaderboardEntry[] = (data || []).map((item: any) => ({
        ...item,
        player_type: item.player_type as 'player' | 'bot'
      }));
      
      setLeaderboard(typedData);
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