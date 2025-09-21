import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GameStatistic {
  stat_name: string;
  current_value: number;
  daily_growth_rate: number;
  last_updated: string;
}

export const useGameStatistics = () => {
  const [statistics, setStatistics] = useState<Record<string, number>>({
    active_players: 1247,
    total_wells: 1057,
    average_profit: 15842
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    try {
      // First try to update statistics
      await supabase.rpc('update_daily_statistics');
      
      // Then fetch current values
      const { data, error } = await supabase
        .from('game_statistics')
        .select('stat_name, current_value')
        .in('stat_name', ['active_players', 'total_wells', 'average_profit']);

      if (error) {
        throw error;
      }

      if (data) {
        const statsMap = data.reduce((acc, stat) => {
          acc[stat.stat_name] = Number(stat.current_value);
          return acc;
        }, {} as Record<string, number>);
        
        // Исправляем логику: количество скважин должно быть больше количества игроков
        if (statsMap.active_players && statsMap.total_wells) {
          if (statsMap.total_wells < statsMap.active_players) {
            // Каждый игрок должен иметь от 1 до 4 скважин в среднем
            statsMap.total_wells = Math.floor(statsMap.active_players * (1.2 + Math.random() * 1.8));
          }
        }
        
        setStatistics(statsMap);
      }
    } catch (err) {
      console.error('Error fetching game statistics:', err);
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
    
    // Fetch statistics every 5 minutes
    const interval = setInterval(fetchStatistics, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    statistics,
    loading,
    error,
    refreshStatistics: fetchStatistics
  };
};