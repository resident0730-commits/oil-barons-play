import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { History, CreditCard, Coins, Calendar, FileText } from "lucide-react";
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

  // Автоматическое обновление при изменениях в money_transfers
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
          console.log('New payment detected, reloading history...');
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
      
      // Загружаем историю пополнений из money_transfers
      const { data, error } = await supabase
        .from('money_transfers')
        .select('*')
        .eq('to_user_id', user.id) // Пополнения - это переводы К пользователю
        .in('transfer_type', ['deposit', 'topup', 'payment']) // Включаем тип 'deposit'
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.log('Error loading payment history:', error);
        setPayments([]);
      } else {
        setPayments(data || []);
      }
    } catch (error) {
      console.error('Error loading payment history:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatRub = (amount: number) => {
    return `${amount.toLocaleString()} ₽`;
  };

  const formatOC = (amount: number) => {
    return `${amount.toLocaleString()} OC`;
  };

  const getOCAmount = (payment: PaymentRecord): number => {
    // Парсим OC из описания если есть паттерн "X OC"
    const ocMatch = payment.description.match(/\((\d+(?:,\d{3})*)\s*OC\)/);
    if (ocMatch) {
      return parseInt(ocMatch[1].replace(/,/g, ''));
    }
    // Иначе считаем как 1:1
    return payment.amount;
  };

  const getInvoiceId = (payment: PaymentRecord): string => {
    // Парсим #ID из описания
    const invoiceMatch = payment.description.match(/#([A-Za-z0-9]+)$/);
    if (invoiceMatch) {
      return invoiceMatch[1];
    }
    return payment.id.slice(-8); // Последние 8 символов ID
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Успешно</Badge>;
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            История пополнений
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          История пополнений
        </CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>У вас пока нет пополнений</p>
            <p className="text-sm">Первое пополнение появится здесь после оплаты</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Заголовки колонок */}
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
              <div>Дата</div>
              <div className="text-center">Заплачено</div>
              <div className="text-center">Получено</div>
              <div className="text-center">Статус</div>
            </div>

            {/* Записи */}
            {payments.map((payment) => (
              <div key={payment.id} className="grid grid-cols-4 gap-4 items-center py-3 border-b last:border-b-0">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {formatDistanceToNow(new Date(payment.created_at), { 
                      addSuffix: true,
                      locale: ru 
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    #{getInvoiceId(payment)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <CreditCard className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-600">
                      {formatRub(payment.amount)}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Coins className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">
                      {formatOC(getOCAmount(payment))}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  {getStatusBadge(payment.status)}
                </div>
              </div>
            ))}

            {/* Итоги */}
            <Separator />
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Всего потрачено</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatRub(payments
                      .filter(p => p.status === 'completed' || p.status === 'success')
                      .reduce((sum, p) => sum + p.amount, 0))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Всего получено</div>
                  <div className="text-lg font-bold text-primary">
                    {formatOC(payments
                      .filter(p => p.status === 'completed' || p.status === 'success')
                      .reduce((sum, p) => sum + getOCAmount(p), 0))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};