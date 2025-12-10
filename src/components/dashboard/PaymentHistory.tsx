import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, FileText, CreditCard, Coins, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface PaymentRecord {
  id: string;
  from_user_id: string;
  to_user_id: string;
  amount: number;
  description: string;
  transfer_type: string;
  status: string;
  created_at: string;
  referred_nickname?: string;
  referral_level?: number;
}

export const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPaymentHistory();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('payment_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'money_transfers',
          filter: `to_user_id=eq.${user.id}`
        },
        () => {
          loadPaymentHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadPaymentHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Получаем переводы из money_transfers
      const { data: transfersData } = await supabase
        .rpc('get_user_transfers');

      // Получаем данные рефералов через безопасную функцию (только несенситивные поля)
      const { data: referralProfilesData } = await supabase
        .rpc('get_referral_profiles', { p_user_id: user.id });

      let referralRecords: PaymentRecord[] = [];

      if (referralProfilesData && referralProfilesData.length > 0) {
        const level1Ids = referralProfilesData.filter((r: any) => r.level === 1).map((r: any) => r.user_id);
        const level2Ids = referralProfilesData.filter((r: any) => r.level === 2).map((r: any) => r.user_id);
        const level3Ids = referralProfilesData.filter((r: any) => r.level === 3).map((r: any) => r.user_id);

        // Получаем все ID рефералов
        const allReferredIds = [...level1Ids, ...level2Ids, ...level3Ids];
        
        if (allReferredIds.length > 0) {
          // Получаем referrals записи где referred_id в нашей цепочке и есть бонус
          const { data: referralsData } = await supabase
            .from('referrals')
            .select('id, referrer_id, referred_id, bonus_earned, created_at, updated_at')
            .in('referred_id', allReferredIds)
            .gt('bonus_earned', 0);

          if (referralsData && referralsData.length > 0) {
            // Используем никнеймы из безопасной функции
            const nicknameMap = new Map(
              referralProfilesData.map((p: any) => [p.user_id, p.nickname])
            );

            // Создаём записи для каждого уровня
            for (const ref of referralsData) {
              let level = 0;
              let bonusAmount = 0;

              if (level1Ids.includes(ref.referred_id)) {
                level = 1;
                bonusAmount = ref.bonus_earned; // 10% уже записан
              } else if (level2Ids.includes(ref.referred_id)) {
                level = 2;
                bonusAmount = Math.floor(ref.bonus_earned * 0.5); // 5% = 50% от 10%
              } else if (level3Ids.includes(ref.referred_id)) {
                level = 3;
                bonusAmount = Math.floor(ref.bonus_earned * 0.3); // 3% = 30% от 10%
              }

              if (bonusAmount > 0) {
                const nickname = nicknameMap.get(ref.referred_id) || 'Игрок';
                referralRecords.push({
                  id: `${ref.id}-lvl${level}`,
                  from_user_id: ref.referred_id,
                  to_user_id: user.id,
                  amount: bonusAmount,
                  description: `Бонус ${level}-го уровня от ${nickname}`,
                  transfer_type: 'referral_bonus',
                  status: 'completed',
                  created_at: ref.updated_at || ref.created_at,
                  referred_nickname: nickname,
                  referral_level: level
                });
              }
            }
          }
        }
      }

      // Фильтруем входящие платежи из transfers
      const incomingPayments = (transfersData || [])
        .filter((transfer: any) => 
          transfer.to_user_id === user.id && 
          ['deposit', 'topup', 'payment'].includes(transfer.transfer_type)
        )
        .map((t: any) => ({ ...t, transfer_type: t.transfer_type }));

      // Объединяем и сортируем
      const allPayments = [...incomingPayments, ...referralRecords]
        .sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 30);

      setPayments(allPayments);
    } catch (error) {
      console.error('Error loading payment history:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatRub = (amount: number) => `${amount.toLocaleString()} ₽`;
  const formatOC = (amount: number) => `${amount.toLocaleString()} OC`;

  const isReferralBonus = (payment: PaymentRecord): boolean => {
    return ['referral_bonus', 'referral_reward'].includes(payment.transfer_type);
  };

  const getGameRubAmount = (payment: PaymentRecord): number => {
    if (isReferralBonus(payment)) {
      return payment.amount;
    }
    const rubMatch = payment.description.match(/=\s*(\d+(?:,\d{3})*)\s*₽/);
    if (rubMatch) return parseInt(rubMatch[1].replace(/,/g, ''));
    const ocMatch = payment.description.match(/\((\d+(?:,\d{3})*)\s*OC\)/);
    if (ocMatch) return parseInt(ocMatch[1].replace(/,/g, ''));
    return payment.amount;
  };

  const getInvoiceId = (payment: PaymentRecord): string => {
    if (isReferralBonus(payment)) {
      return 'REF-' + payment.id.slice(-6);
    }
    const invoiceMatch = payment.description.match(/#([A-Za-z0-9]+)$/);
    return invoiceMatch ? invoiceMatch[1] : payment.id.slice(-8);
  };

  const getPaymentLabel = (payment: PaymentRecord): string => {
    if (payment.transfer_type === 'referral_bonus') {
      return payment.referred_nickname 
        ? `Бонус от ${payment.referred_nickname}` 
        : 'Реферальный бонус';
    }
    if (payment.transfer_type === 'referral_reward') {
      return 'Награда за рефералов';
    }
    return 'Пополнение';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Успешно</Badge>;
      case 'pending':
        return <Badge variant="secondary">Ожидание</Badge>;
      case 'failed':
        return <Badge variant="destructive">Отклонен</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      {payments.length === 0 ? (
        <div className="text-center py-8 text-green-50/70">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-green-100">У вас пока нет пополнений</p>
          <p className="text-sm mt-2">Первое пополнение появится здесь после оплаты</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop */}
          <div className="hidden md:block">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {payments.map((payment) => (
                <Card key={payment.id} className={`bg-background/50 backdrop-blur-sm transition-all duration-200 ${isReferralBonus(payment) ? 'border-purple-500/20 hover:border-purple-500/40' : 'border-green-500/20 hover:border-green-500/40'}`}>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-green-100/80">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true, locale: ru })}
                        </div>
                        {isReferralBonus(payment) && (
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            Реферал
                          </Badge>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    <div className="text-xs text-green-100/60">#{getInvoiceId(payment)}</div>
                    <div className="text-xs font-medium text-green-100/80">{getPaymentLabel(payment)}</div>
                    <Separator className="bg-green-500/20" />
                    <div className="space-y-2">
                      {!isReferralBonus(payment) && (
                        <div className="flex justify-between">
                          <span className="text-sm text-green-100/70">Заплачено:</span>
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4 text-green-400" />
                            <span className="font-semibold text-green-300 text-sm">{formatRub(payment.amount)}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-green-100/70">{isReferralBonus(payment) ? 'Бонус:' : 'Получено:'}</span>
                        <div className="flex items-center gap-1">
                          <Coins className={`h-4 w-4 ${isReferralBonus(payment) ? 'text-purple-400' : 'text-emerald-400'}`} />
                          <span className={`font-semibold text-sm ${isReferralBonus(payment) ? 'text-purple-300' : 'text-emerald-300'}`}>{formatOC(getGameRubAmount(payment))}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-100/70">Статус:</span>
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="md:hidden space-y-3">
            {payments.map((payment) => (
              <Card key={payment.id} className={`bg-background/50 backdrop-blur-sm ${isReferralBonus(payment) ? 'border-purple-500/20' : 'border-green-500/20'}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-green-100/80">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true, locale: ru })}
                    </div>
                    {isReferralBonus(payment) ? (
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        Реферал
                      </Badge>
                    ) : (
                      getStatusBadge(payment.status)
                    )}
                  </div>
                  <div className="text-xs text-green-100/60">#{getInvoiceId(payment)}</div>
                  <div className="text-xs font-medium text-green-100/80">{getPaymentLabel(payment)}</div>
                  <Separator className="bg-green-500/20" />
                  <div className="space-y-2">
                    {!isReferralBonus(payment) && (
                      <div className="flex justify-between">
                        <span className="text-sm text-green-100/70">Заплачено:</span>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4 text-green-400" />
                          <span className="font-semibold text-green-300 text-sm">{formatRub(payment.amount)}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-green-100/70">{isReferralBonus(payment) ? 'Бонус:' : 'Получено:'}</span>
                      <div className="flex items-center gap-1">
                        <Coins className={`h-4 w-4 ${isReferralBonus(payment) ? 'text-purple-400' : 'text-emerald-400'}`} />
                        <span className={`font-semibold text-sm ${isReferralBonus(payment) ? 'text-purple-300' : 'text-emerald-300'}`}>{formatOC(getGameRubAmount(payment))}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
