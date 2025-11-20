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
      const { data, error } = await supabase
        .from('money_transfers')
        .select('*')
        .eq('to_user_id', user.id)
        .in('transfer_type', ['deposit', 'topup', 'payment'])
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        setPayments([]);
      } else {
        setPayments(data || []);
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
      <Card className="bg-card border-border">
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
    <Card className="bg-card border-border">
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
            <p className="text-foreground">У вас пока нет пополнений</p>
            <p className="text-sm mt-2">Первое пополнение появится здесь после оплаты</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop */}
            <div className="hidden md:block">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {payments.map((payment) => (
                  <Card key={payment.id} className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true, locale: ru })}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                      <div className="text-xs text-muted-foreground">#{getInvoiceId(payment)}</div>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Заплачено:</span>
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-600 text-sm">{formatRub(payment.amount)}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Получено:</span>
                          <div className="flex items-center gap-1">
                            <Coins className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-primary text-sm">{formatGameRub(getGameRubAmount(payment))}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Статус:</span>
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
                <Card key={payment.id} className="bg-card border-border">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true, locale: ru })}
                      </div>
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="text-xs text-muted-foreground">#{getInvoiceId(payment)}</div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Заплачено:</span>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-600 text-sm">{formatRub(payment.amount)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Получено:</span>
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-primary text-sm">{formatGameRub(getGameRubAmount(payment))}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
