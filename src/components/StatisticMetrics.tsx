import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AnimatedCounter } from './AnimatedCounter';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Fuel, 
  Zap, 
  Star, 
  Trophy,
  Crown,
  Target,
  Coins,
  BarChart3,
  Activity
} from 'lucide-react';

interface Metric {
  id: string;
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  description: string;
  color: string;
  gradient: string;
  prefix?: string;
  suffix?: string;
  format?: 'number' | 'currency' | 'percentage';
}

const metrics: Metric[] = [
  {
    id: 'total-users',
    title: 'Всего игроков',
    value: 12847,
    change: 23.5,
    icon: <Users className="h-6 w-6" />,
    description: 'Общее количество зарегистрированных игроков в системе',
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'active-wells',
    title: 'Активных скважин',
    value: 8542,
    change: 18.2,
    icon: <Fuel className="h-6 w-6" />,
    description: 'Количество работающих скважин на данный момент',
    color: 'text-amber-400',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 'total-profit',
    title: 'Общая прибыль',
    value: 2840000,
    change: 31.7,
    icon: <DollarSign className="h-6 w-6" />,
    description: 'Суммарная прибыль всех игроков за месяц',
    color: 'text-green-400',
    gradient: 'from-green-500 to-emerald-500',
    prefix: '₽',
    format: 'currency' as const
  },
  {
    id: 'success-rate',
    title: 'Успешность',
    value: 87,
    change: 12.1,
    icon: <Target className="h-6 w-6" />,
    description: 'Процент игроков с положительной доходностью',
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-pink-500',
    suffix: '%',
    format: 'percentage' as const
  },
  {
    id: 'avg-income',
    title: 'Средний доход',
    value: 1547,
    change: 15.8,
    icon: <TrendingUp className="h-6 w-6" />,
    description: 'Средний ежедневный доход игроков',
    color: 'text-primary',
    gradient: 'from-primary to-accent',
    prefix: '₽',
    format: 'currency' as const
  },
  {
    id: 'premium-users',
    title: 'Премиум игроков',
    value: 2156,
    change: 28.4,
    icon: <Crown className="h-6 w-6" />,
    description: 'Количество игроков с премиум статусом',
    color: 'text-yellow-400',
    gradient: 'from-yellow-500 to-amber-500'
  }
];

export const StatisticMetrics = () => {
  const formatValue = (value: number, format?: string, prefix?: string, suffix?: string) => {
    let formattedValue = value;
    
    if (format === 'currency') {
      return `${prefix || ''}${value.toLocaleString()}${suffix || ''}`;
    }
    
    return `${prefix || ''}${value.toLocaleString()}${suffix || ''}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TooltipProvider>
        {metrics.map((metric, index) => (
          <Tooltip key={metric.id}>
            <TooltipTrigger asChild>
              <Card 
                className="group relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 border-primary/20 hover:border-primary/40 shadow-2xl transition-all duration-500 hover:shadow-3xl hover-scale cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Animated background glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Floating particles effect */}
                <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                  <Zap className="h-4 w-4 animate-pulse" />
                </div>
                
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${metric.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {metric.icon}
                      </div>
                    </div>
                    
                    <Badge 
                      className={`bg-green-500/20 text-green-400 border-green-500/30 animate-pulse`}
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{metric.change}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-slate-400 font-medium">
                      {metric.title}
                    </p>
                    
                    <div className={`text-3xl font-bold ${metric.color} group-hover:scale-105 transition-transform duration-300`}>
                      <AnimatedCounter
                        end={metric.value}
                        duration={1500}
                        prefix={metric.prefix}
                        suffix={metric.suffix}
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Activity className="h-4 w-4 text-slate-500" />
                      <p className="text-xs text-slate-500">
                        За последние 30 дней
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-4 bg-slate-700/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${metric.gradient} transition-all duration-1000 ease-out animate-glow-pulse`}
                      style={{ width: `${Math.min(metric.change * 3, 100)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            
            <TooltipContent 
              side="top"
              className="bg-slate-900/95 backdrop-blur-xl border border-primary/30 text-white p-4 max-w-xs"
            >
              <div className="space-y-2">
                <p className="font-semibold text-primary">{metric.title}</p>
                <p className="text-sm text-slate-300">{metric.description}</p>
                <div className="flex items-center gap-2 pt-1">
                  <Star className="h-3 w-3 text-accent" />
                  <span className="text-xs text-accent">
                    Рост на {metric.change}% за месяц
                  </span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};