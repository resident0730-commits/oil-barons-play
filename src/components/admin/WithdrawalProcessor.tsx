import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Withdrawal {
  id: string;
  from_user_id: string;
  amount: number;
  description: string;
  created_at: string;
  status: string;
  withdrawal_details: any;
  from_nickname?: string;
}

export function WithdrawalProcessor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState<string | null>(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [transferDetails, setTransferDetails] = useState('');

  const loadWithdrawals = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: withdrawalsData, error } = await supabase
        .from('money_transfers')
        .select('*')
        .eq('transfer_type', 'withdrawal')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user nicknames
      const withdrawalsWithNames = await Promise.all(
        (withdrawalsData || []).map(async (withdrawal) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('nickname')
            .eq('user_id', withdrawal.from_user_id)
            .single();

          return {
            ...withdrawal,
            from_nickname: profile?.nickname
          };
        })
      );

      setWithdrawals(withdrawalsWithNames);
    } catch (error) {
      console.error('Error loading withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, [user]);

  const processWithdrawal = async (withdrawalId: string, status: 'completed' | 'rejected') => {
    if (!user) return;

    setProcessLoading(withdrawalId);
    try {
      const { error } = await supabase.rpc('process_withdrawal', {
        p_transfer_id: withdrawalId,
        p_status: status,
        p_admin_id: user.id
      });

      if (error) throw error;

      // If completed, create a fake transfer record to show in history
      if (status === 'completed' && selectedWithdrawal) {
        const withdrawalDetails = selectedWithdrawal.withdrawal_details && typeof selectedWithdrawal.withdrawal_details === 'object' ? selectedWithdrawal.withdrawal_details : {};
        const { error: fakeTransferError } = await supabase
          .from('money_transfers')
          .insert({
            from_user_id: user.id, // Admin
            to_user_id: selectedWithdrawal.from_user_id, // User who requested withdrawal
            amount: selectedWithdrawal.amount,
            description: `Обработка вывода: ${transferDetails || withdrawalDetails.details || 'Без деталей'}`,
            transfer_type: 'admin_transfer',
            created_by: user.id,
            status: 'completed'
          });

        if (fakeTransferError) console.error('Error creating fake transfer:', fakeTransferError);
      }

      toast({
        title: status === 'completed' ? "Вывод обработан" : "Вывод отклонен",
        description: `Заявка на вывод ${status === 'completed' ? 'успешно обработана' : 'отклонена'}`,
      });

      await loadWithdrawals();
      setSelectedWithdrawal(null);
      setTransferDetails('');
    } catch (error: any) {
      console.error('Error processing withdrawal:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обработать заявку",
        variant: "destructive",
      });
    } finally {
      setProcessLoading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Обработан</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Отклонен</Badge>;
      default:
        return <Badge variant="secondary">Ожидает</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Обработка выводов ({withdrawals.filter(w => w.status === 'pending').length})
        </CardTitle>
        <Button variant="outline" size="sm" onClick={loadWithdrawals} disabled={loading}>
          {loading ? "Загрузка..." : "Обновить"}
        </Button>
      </CardHeader>
      <CardContent>
        {withdrawals.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Нет заявок на вывод
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Игрок</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Способ</TableHead>
                  <TableHead>Реквизиты</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>
                      {getStatusIcon(withdrawal.status)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(withdrawal.status)}
                    </TableCell>
                    <TableCell>
                      {withdrawal.from_nickname || 'Неизвестный'}
                    </TableCell>
                    <TableCell className="font-medium">
                      {withdrawal.amount.toLocaleString()} ₽
                    </TableCell>
                    <TableCell>
                      {withdrawal.withdrawal_details && typeof withdrawal.withdrawal_details === 'object' && withdrawal.withdrawal_details.method || 'Не указан'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {withdrawal.withdrawal_details && typeof withdrawal.withdrawal_details === 'object' && withdrawal.withdrawal_details.details || 'Не указаны'}
                    </TableCell>
                    <TableCell>
                      {new Date(withdrawal.created_at).toLocaleString('ru-RU')}
                    </TableCell>
                    <TableCell>
                      {withdrawal.status === 'pending' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              onClick={() => setSelectedWithdrawal(withdrawal)}
                            >
                              Обработать
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Обработка вывода</DialogTitle>
                              <DialogDescription>
                                Игрок: {withdrawal.from_nickname}<br/>
                                Сумма: {withdrawal.amount.toLocaleString()} ₽<br/>
                                Способ: {withdrawal.withdrawal_details && typeof withdrawal.withdrawal_details === 'object' && withdrawal.withdrawal_details.method}<br/>
                                Реквизиты: {withdrawal.withdrawal_details && typeof withdrawal.withdrawal_details === 'object' && withdrawal.withdrawal_details.details}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div>
                              <Label htmlFor="transfer-details">Детали перевода (для истории)</Label>
                              <Input
                                id="transfer-details"
                                placeholder="Например: Переведено на карту *1234"
                                value={transferDetails}
                                onChange={(e) => setTransferDetails(e.target.value)}
                              />
                            </div>

                            <DialogFooter className="flex gap-2">
                              <Button
                                variant="destructive"
                                onClick={() => processWithdrawal(withdrawal.id, 'rejected')}
                                disabled={processLoading === withdrawal.id}
                              >
                                Отклонить
                              </Button>
                              <Button
                                onClick={() => processWithdrawal(withdrawal.id, 'completed')}
                                disabled={processLoading === withdrawal.id}
                              >
                                {processLoading === withdrawal.id ? "Обработка..." : "Одобрить"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}