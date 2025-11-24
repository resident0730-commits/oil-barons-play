import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreditCard, Clock, CheckCircle, XCircle, History } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WithdrawalRecord {
  id: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  withdrawal_details: any;
}

export function WithdrawalHistory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWithdrawalHistory = async () => {
    if (!user) return;

    try {
      // Используем безопасную функцию для получения переводов
      const { data, error } = await supabase
        .rpc('get_user_transfers');

      if (error) throw error;

      // Фильтруем только выводы
      const userWithdrawals = (data || [])
        .filter((transfer: any) => 
          transfer.from_user_id === user.id && 
          transfer.transfer_type === 'withdrawal'
        )
        .sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      setWithdrawals(userWithdrawals);
    } catch (error: any) {
      console.error('Error loading withdrawal history:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить историю выводов",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadWithdrawalHistory();
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">На рассмотрении</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Завершено</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Отклонено</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMethodName = (method: string) => {
    const methods = {
      'card': 'Банковская карта',
      'qiwi': 'QIWI кошелек',
      'yoomoney': 'ЮMoney',
      'paypal': 'PayPal',
      'crypto': 'Криптовалюта'
    };
    return methods[method as keyof typeof methods] || method;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Загружаем историю выводов...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          История выводов
        </CardTitle>
      </CardHeader>
      <CardContent>
        {withdrawals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>История выводов пуста</p>
            <p className="text-sm">Создайте первую заявку на вывод средств</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(withdrawal.status)}
                      <span className="font-medium">
                        {withdrawal.amount.toLocaleString()} ₽
                      </span>
                    </div>
                    {getStatusBadge(withdrawal.status)}
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Дата создания:</span>
                      <span>{formatDate(withdrawal.created_at)}</span>
                    </div>
                    
                    {withdrawal.withdrawal_details && (
                      <>
                        <div className="flex justify-between">
                          <span>Способ вывода:</span>
                          <span>{getMethodName(withdrawal.withdrawal_details.method)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Реквизиты:</span>
                          <span className="font-mono text-xs">
                            {withdrawal.withdrawal_details.details}
                          </span>
                        </div>
                        {withdrawal.withdrawal_details.description && (
                          <div className="mt-2">
                            <span className="block mb-1">Комментарий:</span>
                            <span className="text-xs bg-muted p-2 rounded block">
                              {withdrawal.withdrawal_details.description}
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {withdrawal.created_at !== withdrawal.updated_at && (
                      <div className="flex justify-between pt-2 border-t">
                        <span>Последнее обновление:</span>
                        <span>{formatDate(withdrawal.updated_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}