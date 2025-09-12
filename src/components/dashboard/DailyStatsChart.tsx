import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { DailyStat } from "@/hooks/useDailyStats";

interface Props {
  stats: DailyStat[];
}

export default function DailyStatsChart({ stats }: Props) {
  const data = useMemo(
    () =>
      stats.map((s) => ({
        date: new Date(s.date).toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" }),
        balance: Number(s.balance ?? 0),
        income: Number(s.income ?? 0),
        wells: Number(s.wells ?? 0),
      })),
    [stats]
  );

  if (!stats?.length) {
    return <div className="text-sm text-muted-foreground">Нет данных для отображения статистики.</div>;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }} />
          <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorBalance)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
