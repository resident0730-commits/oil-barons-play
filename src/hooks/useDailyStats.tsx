import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DailyStat {
  id: string;
  user_id: string;
  date: string; // ISO date (YYYY-MM-DD)
  balance_start: number;
  balance_end: number;
  wells_count: number;
  daily_income_total: number;
  investments_made: number;
  created_at: string;
}

interface TodaySnapshot {
  balance: number;
  wellsCount: number;
  dailyIncome: number;
  investments?: number;
}

export function useDailyStats(userId?: string) {
  const [stats, setStats] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const fetchStats = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("daily_stats")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: true });

      if (error) throw error;

      const typed: DailyStat[] = (data || []).map((row: any) => ({
        ...row,
        balance_start: Number(row.balance_start ?? 0),
        balance_end: Number(row.balance_end ?? 0),
        wells_count: Number(row.wells_count ?? 0),
        daily_income_total: Number(row.daily_income_total ?? 0),
        investments_made: Number(row.investments_made ?? 0),
      }));

      setStats(typed);
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
      if (!userId) return { success: false, error: "no-user" } as const;
      try {
        // Check if today exists
        const { data: existing, error: checkErr } = await supabase
          .from("daily_stats")
          .select("id")
          .eq("user_id", userId)
          .eq("date", today)
          .maybeSingle();

        if (checkErr) throw checkErr;

        if (existing) {
          // Update end values for today
          const { error: updateErr } = await supabase
            .from("daily_stats")
            .update({
              balance_end: snapshot.balance,
              wells_count: snapshot.wellsCount,
              daily_income_total: snapshot.dailyIncome,
            })
            .eq("id", existing.id);

          if (updateErr) throw updateErr;
        } else {
          // Insert new row for today
          const { error: insertErr } = await supabase.from("daily_stats").insert({
            user_id: userId,
            date: today,
            balance_start: snapshot.balance,
            balance_end: snapshot.balance,
            wells_count: snapshot.wellsCount,
            daily_income_total: snapshot.dailyIncome,
            investments_made: snapshot.investments ?? 0,
          });
          if (insertErr) throw insertErr;
        }

        await fetchStats();
        return { success: true } as const;
      } catch (e: any) {
        console.error("Failed to upsert today's stats", e);
        return { success: false, error: e?.message || "update-failed" } as const;
      }
    },
    [userId, today, fetchStats]
  );

  return { stats, loading, error, upsertToday, refresh: fetchStats } as const;
}
