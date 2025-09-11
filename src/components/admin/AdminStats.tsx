import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, Building, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  total_users: number;
  active_users: number;
  banned_users: number;
  total_wells: number;
  total_balance: number;
}

export function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase.rpc('get_user_statistics');
        
        if (error) {
          console.error('Error fetching stats:', error);
        } else if (data && data.length > 0) {
          setStats(data[0]);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Не удалось загрузить статистику</p>
        </CardContent>
      </Card>
    );
  }

  const statItems = [
    {
      title: 'Всего игроков',
      value: stats.total_users,
      icon: Users,
      className: 'text-blue-600'
    },
    {
      title: 'Активные игроки',
      value: stats.active_users,
      icon: UserCheck,
      className: 'text-green-600'
    },
    {
      title: 'Заблокированные',
      value: stats.banned_users,
      icon: UserX,
      className: 'text-red-600'
    },
    {
      title: 'Всего скважин',
      value: stats.total_wells,
      icon: Building,
      className: 'text-amber-600'
    },
    {
      title: 'Общий баланс',
      value: `₽${Number(stats.total_balance).toLocaleString()}`,
      icon: DollarSign,
      className: 'text-emerald-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <item.icon className={`h-4 w-4 ${item.className}`} />
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}