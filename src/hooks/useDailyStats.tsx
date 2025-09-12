import { useMemo, useState } from "react";

export interface DailyStat {
  date: string;
  balance: number;
  income: number;
  wells: number;
}

interface TodaySnapshot {
  balance: number;
  wellsCount: number;
  dailyIncome: number;
}

export function useDailyStats(userId?: string) {
  const [stats] = useState<DailyStat[]>([]);
  const loading = false;
  const error = null;

  // Generate mock data for the last 7 days
  const mockStats = useMemo(() => {
    const data: DailyStat[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().slice(0, 10),
        balance: 1000000 + Math.random() * 500000 + i * 100000,
        income: 10000 + Math.random() * 5000 + i * 1000,
        wells: Math.floor(3 + Math.random() * 5 + i * 0.5),
      });
    }
    
    return data;
  }, [userId]);

  const upsertToday = async (snapshot: TodaySnapshot) => {
    // Mock implementation - in real app would save to database
    console.log('Recording daily stats:', snapshot);
    return { success: true } as const;
  };

  return { stats: mockStats, loading, error, upsertToday, refresh: () => {} } as const;
}
