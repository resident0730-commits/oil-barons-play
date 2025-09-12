import { useCallback, useEffect, useState } from "react";
import { hasSupabase, supabase } from "@/lib/supabase";

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
  const [stats, setStats] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!userId || !hasSupabase) {
      setStats([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const start = new Date();
      start.setDate(start.getDate() - 6); // last 7 days including today
      const startDate = start.toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from("daily_stats")
        .select("date,balance_end,daily_income_total,wells_count")
        .eq("user_id", userId)
        .gte("date", startDate)
        .order("date", { ascending: true });

      if (error) throw error;

      const mapped: DailyStat[] = (data || []).map((row: any) => ({
        date: row.date,
        balance: Number(row.balance_end ?? 0),
        income: Number(row.daily_income_total ?? 0),
        wells: Number(row.wells_count ?? 0),
      }));

      setStats(mapped);
    } catch (e: any) {
      console.error("Failed to fetch daily stats", e);
      setError(e?.message || "Не удалось загрузить статистику");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const upsertToday = useCallback(
    async (snapshot: TodaySnapshot) => {
      if (!userId || !hasSupabase) return { success: false } as const;
      try {
        const { error } = await supabase.rpc("record_daily_stats", {
          p_user_id: userId,
          p_balance_end: snapshot.balance,
          p_daily_income_total: snapshot.dailyIncome,
          p_wells_count: snapshot.wellsCount,
        });
        if (error) throw error;
        await fetchStats();
        return { success: true } as const;
      } catch (e) {
        console.error("Failed to upsert daily stats", e);
        return { success: false } as const;
      }
    },
    [userId, fetchStats]
  );

  return { stats, loading, error, upsertToday, refresh: fetchStats } as const;
}

