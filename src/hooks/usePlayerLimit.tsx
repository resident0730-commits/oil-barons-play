import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlayerLimitData {
  currentPlayers: number;
  maxPlayers: number;
  progressPercentage: number;
  spotsLeft: number;
  isLimitReached: boolean;
}

export const usePlayerLimit = () => {
  const [data, setData] = useState<PlayerLimitData>({
    currentPlayers: 0,
    maxPlayers: 10000,
    progressPercentage: 0,
    spotsLeft: 10000,
    isLimitReached: false,
  });
  const [loading, setLoading] = useState(true);

  const loadPlayerCount = async () => {
    try {
      // Получаем количество игроков из game_statistics для консистентности с другими частями приложения
      const { data, error } = await supabase
        .from('game_statistics')
        .select('current_value')
        .eq('stat_name', 'active_players')
        .single();

      if (error) {
        console.error('Error fetching player count from game_statistics:', error);
        return;
      }

      const currentPlayers = data?.current_value || 0;
      const maxPlayers = 10000;
      const progressPercentage = Math.min((currentPlayers / maxPlayers) * 100, 100);
      const spotsLeft = Math.max(maxPlayers - currentPlayers, 0);
      const isLimitReached = currentPlayers >= maxPlayers;

      setData({
        currentPlayers,
        maxPlayers,
        progressPercentage,
        spotsLeft,
        isLimitReached,
      });
    } catch (error) {
      console.error('Error loading player count:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayerCount();
  }, []);

  return {
    ...data,
    loading,
    refresh: loadPlayerCount,
  };
};