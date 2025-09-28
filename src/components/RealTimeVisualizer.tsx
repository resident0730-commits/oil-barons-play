import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  Users, 
  DollarSign,
  Wifi,
  Radio
} from 'lucide-react';

interface RealtimeData {
  activeUsers: number;
  totalRevenue: number;
  transactionsPerMinute: number;
  systemHealth: number;
  lastUpdate: string;
}

export const RealTimeVisualizer = () => {
  const [data, setData] = useState<RealtimeData>({
    activeUsers: 247,
    totalRevenue: 156420,
    transactionsPerMinute: 12,
    systemHealth: 98.5,
    lastUpdate: new Date().toLocaleTimeString('ru-RU')
  });

  const [pulseCount, setPulseCount] = useState(0);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3 - 1),
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 500),
        transactionsPerMinute: Math.max(0, prev.transactionsPerMinute + Math.floor(Math.random() * 3 - 1)),
        systemHealth: Math.max(90, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 2)),
        lastUpdate: new Date().toLocaleTimeString('ru-RU')
      }));
      setPulseCount(prev => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-400';
    if (health >= 85) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthGradient = (health: number) => {
    if (health >= 95) return 'from-green-500 to-emerald-500';
    if (health >= 85) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 border-primary/30 shadow-2xl overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent flex items-center gap-2">
            <Wifi className="h-5 w-5 text-primary animate-pulse" />
            🔴 Live Статистика
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-slate-400">Online</span>
            </div>
            <Badge className="bg-slate-700/50 text-slate-300 text-xs">
              {data.lastUpdate}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Real-time metrics grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Active Users */}
          <div className="relative p-4 bg-slate-800/50 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 group">
            <div className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity">
              <Radio className="h-4 w-4 text-blue-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
              <span className="text-sm text-slate-400">Онлайн</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {data.activeUsers}
            </div>
          </div>

          {/* Revenue */}
          <div className="relative p-4 bg-slate-800/50 rounded-xl border border-accent/20 hover:border-accent/40 transition-all duration-300 group">
            <div className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity">
              <TrendingUp className="h-4 w-4 text-green-400 animate-bounce" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-400" />
              </div>
              <span className="text-sm text-slate-400">Доход</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              ₽{data.totalRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Transaction rate */}
        <div className="p-4 bg-slate-800/50 rounded-xl border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-400" />
              <span className="text-sm font-medium text-slate-300">
                Транзакции в минуту
              </span>
            </div>
            <Badge className="bg-purple-500/20 text-purple-400">
              {data.transactionsPerMinute} TPM
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`w-2 rounded-full transition-all duration-300 ${
                  i < Math.floor(data.transactionsPerMinute / 2) 
                    ? 'bg-purple-500 h-8 animate-pulse' 
                    : 'bg-slate-700 h-4'
                }`}
                style={{
                  animationDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="p-4 bg-slate-800/50 rounded-xl border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-slate-300">
                Стабильность системы
              </span>
            </div>
            <span className={`text-lg font-bold ${getHealthColor(data.systemHealth)}`}>
              {data.systemHealth.toFixed(1)}%
            </span>
          </div>
          
          <Progress 
            value={data.systemHealth} 
            className="h-3 bg-slate-700/50"
          />
          <div 
            className={`absolute inset-0 h-3 bg-gradient-to-r ${getHealthGradient(data.systemHealth)} rounded-full animate-glow-pulse`}
            style={{ width: `${data.systemHealth}%` }}
          />
        </div>

        {/* Live activity indicator */}
        <div className="flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 200}ms`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
          <span className="text-sm text-slate-400">
            Обновления каждые 3 секунды • Пульс #{pulseCount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};