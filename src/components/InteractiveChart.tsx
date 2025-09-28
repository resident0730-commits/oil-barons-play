import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';

interface ChartData {
  name: string;
  value: number;
  profit: number;
  players: number;
}

const generateData = (): ChartData[] => {
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
  return months.map((month, index) => ({
    name: month,
    value: 1000 + index * 300 + Math.random() * 200,
    profit: 15000 + index * 2000 + Math.random() * 1000,
    players: 800 + index * 150 + Math.random() * 100
  }));
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-xl border border-primary/30 rounded-xl p-4 shadow-2xl">
        <p className="text-white font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-300">
              {entry.name}: <span className="text-white font-bold">
                {entry.name.includes('Прибыль') ? `₽${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
              </span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const InteractiveChart = () => {
  const data = generateData();
  
  const totalGrowth = ((data[data.length - 1].value - data[0].value) / data[0].value * 100).toFixed(1);
  const profitGrowth = ((data[data.length - 1].profit - data[0].profit) / data[0].profit * 100).toFixed(1);

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 border-primary/30 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          📊 Статистика роста
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
            <TabsTrigger value="revenue" className="data-[state=active]:bg-primary/20">
              Доходность
            </TabsTrigger>
            <TabsTrigger value="profit" className="data-[state=active]:bg-accent/20">
              Прибыль
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary/20">
              Игроки
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="mt-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-lg font-semibold text-white">
                  Рост доходности: +{totalGrowth}%
                </span>
              </div>
              <p className="text-slate-400">За последние 6 месяцев</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={3}
                  name="Доходность"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="profit" className="mt-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-accent" />
                <span className="text-lg font-semibold text-white">
                  Рост прибыли: +{profitGrowth}%
                </span>
              </div>
              <p className="text-slate-400">Средняя прибыль игроков</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(var(--accent))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: 'hsl(var(--accent))', strokeWidth: 2 }}
                  name="Прибыль (₽)"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold text-white">
                  Активная аудитория
                </span>
              </div>
              <p className="text-slate-400">Количество активных игроков</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="players"
                  stroke="hsl(var(--accent))"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  strokeWidth={3}
                  name="Игроки"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};