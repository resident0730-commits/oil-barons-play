import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, RefreshCw, Search, TrendingUp, Coins, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReferralData {
  id: string;
  referrer_id: string;
  referrer_nickname: string;
  referred_id: string;
  referred_nickname: string;
  bonus_earned: number;
  referral_code: string;
  is_active: boolean;
  created_at: string;
  referred_total_payments: number;
}

interface ReferrerStats {
  user_id: string;
  nickname: string;
  level1_count: number;
  level2_count: number;
  level3_count: number;
  level1_bonus: number;
  level2_bonus: number;
  level3_bonus: number;
  total_bonus: number;
}

export function ReferralChainManager() {
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [referrerStats, setReferrerStats] = useState<ReferrerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const loadReferralData = async () => {
    setLoading(true);
    try {
      // Загружаем все реферальные связи
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false });

      if (referralsError) throw referralsError;

      // Загружаем никнеймы для всех пользователей
      const userIds = new Set<string>();
      referralsData?.forEach(r => {
        userIds.add(r.referrer_id);
        userIds.add(r.referred_id);
      });

      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, nickname')
        .in('user_id', Array.from(userIds));

      const nicknameMap = new Map<string, string>();
      profiles?.forEach(p => nicknameMap.set(p.user_id, p.nickname));

      // Загружаем платежи для рефералов
      const { data: payments } = await supabase
        .from('payment_invoices')
        .select('user_id, amount')
        .eq('status', 'completed');

      const paymentMap = new Map<string, number>();
      payments?.forEach(p => {
        const current = paymentMap.get(p.user_id) || 0;
        paymentMap.set(p.user_id, current + Number(p.amount));
      });

      // Формируем данные с никнеймами
      const enrichedReferrals: ReferralData[] = (referralsData || []).map(r => ({
        ...r,
        referrer_nickname: nicknameMap.get(r.referrer_id) || 'Неизвестно',
        referred_nickname: nicknameMap.get(r.referred_id) || 'Неизвестно',
        referred_total_payments: paymentMap.get(r.referred_id) || 0,
      }));

      setReferrals(enrichedReferrals);

      // Вычисляем статистику по реферерам
      const statsMap = new Map<string, ReferrerStats>();

      // Уровень 1 - прямые рефералы
      enrichedReferrals.forEach(r => {
        if (!statsMap.has(r.referrer_id)) {
          statsMap.set(r.referrer_id, {
            user_id: r.referrer_id,
            nickname: r.referrer_nickname,
            level1_count: 0,
            level2_count: 0,
            level3_count: 0,
            level1_bonus: 0,
            level2_bonus: 0,
            level3_bonus: 0,
            total_bonus: 0,
          });
        }
        const stats = statsMap.get(r.referrer_id)!;
        stats.level1_count++;
        stats.level1_bonus += Number(r.bonus_earned);
      });

      // Уровень 2 - рефералы рефералов
      enrichedReferrals.forEach(r1 => {
        enrichedReferrals.forEach(r2 => {
          if (r2.referrer_id === r1.referred_id) {
            const stats = statsMap.get(r1.referrer_id);
            if (stats) {
              stats.level2_count++;
              stats.level2_bonus += Math.floor(Number(r2.bonus_earned) * 0.5); // 5% от суммы, у L1 10%
            }
          }
        });
      });

      // Уровень 3 - рефералы рефералов рефералов
      enrichedReferrals.forEach(r1 => {
        enrichedReferrals.forEach(r2 => {
          if (r2.referrer_id === r1.referred_id) {
            enrichedReferrals.forEach(r3 => {
              if (r3.referrer_id === r2.referred_id) {
                const stats = statsMap.get(r1.referrer_id);
                if (stats) {
                  stats.level3_count++;
                  stats.level3_bonus += Math.floor(Number(r3.bonus_earned) * 0.3); // 3% от суммы
                }
              }
            });
          }
        });
      });

      // Подсчет общих бонусов
      statsMap.forEach(stats => {
        stats.total_bonus = stats.level1_bonus + stats.level2_bonus + stats.level3_bonus;
      });

      setReferrerStats(Array.from(statsMap.values()).sort((a, b) => b.total_bonus - a.total_bonus));

    } catch (error) {
      console.error('Error loading referral data:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные рефералов',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReferralData();

    // Подписка на реальное время
    const channel = supabase
      .channel('referrals-admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'referrals' },
        () => loadReferralData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payment_invoices' },
        () => loadReferralData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredReferrals = referrals.filter(r =>
    r.referrer_nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.referred_nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.referral_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStats = referrerStats.filter(s =>
    s.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalReferrals = referrals.length;
  const totalBonuses = referrerStats.reduce((sum, s) => sum + s.total_bonus, 0);
  const activeReferrers = referrerStats.filter(s => s.level1_count > 0).length;

  return (
    <div className="space-y-6">
      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalReferrals}</p>
                <p className="text-sm text-muted-foreground">Всего рефералов</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Coins className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{totalBonuses.toLocaleString()} OC</p>
                <p className="text-sm text-muted-foreground">Всего бонусов</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{activeReferrers}</p>
                <p className="text-sm text-muted-foreground">Активных рефереров</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {referrals.filter(r => r.referred_total_payments > 0).length}
                </p>
                <p className="text-sm text-muted-foreground">С пополнениями</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Поиск и обновление */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по никнейму или коду..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={loadReferralData} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

      {/* Статистика по рефереррам */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Топ рефереров по бонусам
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Реферер</TableHead>
                <TableHead className="text-center">L1</TableHead>
                <TableHead className="text-center">L2</TableHead>
                <TableHead className="text-center">L3</TableHead>
                <TableHead className="text-right">Бонус L1</TableHead>
                <TableHead className="text-right">Бонус L2</TableHead>
                <TableHead className="text-right">Бонус L3</TableHead>
                <TableHead className="text-right">Всего</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStats.map((stats) => (
                <TableRow key={stats.user_id}>
                  <TableCell className="font-medium">{stats.nickname}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{stats.level1_count}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{stats.level2_count}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge>{stats.level3_count}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    +{stats.level1_bonus} OC
                  </TableCell>
                  <TableCell className="text-right text-blue-600">
                    +{stats.level2_bonus} OC
                  </TableCell>
                  <TableCell className="text-right text-purple-600">
                    +{stats.level3_bonus} OC
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    {stats.total_bonus} OC
                  </TableCell>
                </TableRow>
              ))}
              {filteredStats.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Нет данных
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Все реферальные связи */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Все реферальные связи ({filteredReferrals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Реферер</TableHead>
                <TableHead>Реферал</TableHead>
                <TableHead>Код</TableHead>
                <TableHead className="text-right">Платежи реферала</TableHead>
                <TableHead className="text-right">Бонус L1 (10%)</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReferrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell className="font-medium">{referral.referrer_nickname}</TableCell>
                  <TableCell>{referral.referred_nickname}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {referral.referral_code}
                    </code>
                  </TableCell>
                  <TableCell className="text-right">
                    {referral.referred_total_payments > 0 ? (
                      <span className="text-green-600 font-medium">
                        {referral.referred_total_payments.toLocaleString()} OC
                      </span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {referral.bonus_earned > 0 ? (
                      <span className="text-green-600 font-medium">
                        +{referral.bonus_earned} OC
                      </span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={referral.is_active ? 'default' : 'secondary'}>
                      {referral.is_active ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(referral.created_at).toLocaleDateString('ru-RU')}
                  </TableCell>
                </TableRow>
              ))}
              {filteredReferrals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Нет реферальных связей
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
