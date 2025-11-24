import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, FileText, CreditCard, Coins } from "lucide-react";
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
      // Используем безопасную функцию для получения переводов
      const { data, error } = await supabase
        .rpc('get_user_transfers');

      if (error) {
        setPayments([]);
      } else {
        // Фильтруем только входящие платежи
        const incomingPayments = (data || [])
          .filter((transfer: any) => 
            transfer.to_user_id === user.id && 
            ['deposit', 'topup', 'payment'].includes(transfer.transfer_type)
          )
          .sort((a: any, b: any) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          .slice(0, 20);
        setPayments(incomingPayments);
      }
    } catch (error) {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatRub = (amount: number) => `${amount.toLocaleString()} ₽`;
  const formatGameRub = (amount: number) => `${amount.toLocaleString()} ₽`;

  const getGameRubAmount = (payment: PaymentRecord): number => {
    const rubMatch = payment.description.match(/=\s*(\d+(?:,\d{3})*)\s*₽/);
    if (rubMatch) return parseInt(rubMatch[1].replace(/,/g, ''));
    const ocMatch = payment.description.match(/\((\d+(?:,\d{3})*)\s*OC\)/);
    if (ocMatch) return parseInt(ocMatch[1].replace(/,/g, ''));
    return payment.amount;
  };

  const getInvoiceId = (payment: PaymentRecord): string => {
    const invoiceMatch = payment.description.match(/#([A-Za-z0-9]+)$/);
    return invoiceMatch ? invoiceMatch[1] : payment.id.slice(-8);
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
                <Card key={payment.id} className="bg-background/50 backdrop-blur-sm border-green-500/20 hover:border-green-500/40 transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      <div className="flex items-center gap-2 text-xs text-green-100/80">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true, locale: ru })}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    <div className="text-xs text-green-100/60">#{getInvoiceId(payment)}</div>
                    <Separator className="bg-green-500/20" />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-green-100/70">Заплачено:</span>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4 text-green-400" />
                          <span className="font-semibold text-green-300 text-sm">{formatRub(payment.amount)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-100/70">Получено:</span>
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-emerald-400" />
                          <span className="font-semibold text-emerald-300 text-sm">{formatGameRub(getGameRubAmount(payment))}</span>
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

          {/* Mobile */}
          <div className="md:hidden space-y-3">
            {payments.map((payment) => (
              <Card key={payment.id} className="bg-background/50 backdrop-blur-sm border-green-500/20">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-green-100/80">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true, locale: ru })}
                    </div>
                    {getStatusBadge(payment.status)}
                  </div>
                  <div className="text-xs text-green-100/60">#{getInvoiceId(payment)}</div>
                  <Separator className="bg-green-500/20" />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-100/70">Заплачено:</span>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4 text-green-400" />
                        <span className="font-semibold text-green-300 text-sm">{formatRub(payment.amount)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-100/70">Получено:</span>
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-emerald-400" />
                        <span className="font-semibold text-emerald-300 text-sm">{formatGameRub(getGameRubAmount(payment))}</span>
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
