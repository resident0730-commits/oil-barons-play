import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  CreditCard, 
  DollarSign,
  Eye
} from 'lucide-react';
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

interface WithdrawalRequest {
  id: string;
  from_user_id: string;
  amount: number;
  description: string;
  status: string;
  withdrawal_details: any;
  created_at: string;
  from_nickname?: string;
}

export function WithdrawalProcessor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [transferDetails, setTransferDetails] = useState('');

  const loadWithdrawals = async () => {
    try {
      const { data: withdrawalsData, error } = await supabase
        .from('money_transfers')
        .select('*')
        .eq('transfer_type', 'withdrawal')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Get profile names for each withdrawal
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
  }, []);

  const processWithdrawal = async (transferId: string, status: 'completed' | 'rejected') => {
    if (!user) return;

    setProcessing(transferId);
    try {
      // Process the withdrawal
      const { error } = await supabase.rpc('process_withdrawal', {
        p_transfer_id: transferId,
        p_status: status,
        p_admin_id: user.id
      });

      if (error) throw error;

      // If completing withdrawal, simulate the actual transfer
      if (status === 'completed' && selectedWithdrawal) {
        // Add a "completed" record to show the actual transfer happened
        const { error: completeError } = await supabase
          .from('money_transfers')
          .insert({
            from_user_id: user.id, // Admin as sender
            to_user_id: selectedWithdrawal.from_user_id,
            amount: selectedWithdrawal.amount,
            description: `✅ Выполнен вывод на ${selectedWithdrawal.withdrawal_details?.method || 'неизвестный способ'}: ${selectedWithdrawal.withdrawal_details?.details || 'реквизиты не указаны'}${transferDetails ? ` - ${transferDetails}` : ''}`,
            transfer_type: 'admin_transfer',
            status: 'completed',
            created_by: user.id
          });

        if (completeError) throw completeError;
      }

      await loadWithdrawals();

      toast({
        title: status === 'completed' ? "Вывод выполнен" : "Вывод отклонен",
        description: status === 'completed' 
          ? `Вывод ${selectedWithdrawal?.amount.toLocaleString()} ₽ успешно выполнен`
          : "Заявка на вывод отклонена",
      });

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
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Ожидает
        </Badge>;
      case 'completed':
        return <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Выполнен
        </Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Отклонен
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Обработка выводов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Заявки на вывод ({withdrawals.filter(w => w.status === 'pending').length})
          </CardTitle>
          <Button variant="outline" size="sm" onClick={loadWithdrawals}>
            Обновить
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
                    <TableHead>Игрок</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Способ</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell className="font-medium">
                        {withdrawal.from_nickname}
                      </TableCell>
                      <TableCell>
                        {withdrawal.amount.toLocaleString()} ₽
                      </TableCell>
                      <TableCell>
                        {withdrawal.withdrawal_details?.method || 'Не указан'}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(withdrawal.status)}
                      </TableCell>
                      <TableCell>
                        {new Date(withdrawal.created_at).toLocaleString('ru-RU')}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedWithdrawal(withdrawal)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Детали
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Обработка вывода
                              </DialogTitle>
                              <DialogDescription>
                                Заявка от {withdrawal.from_nickname} на сумму {withdrawal.amount.toLocaleString()} ₽
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
                                <div><strong>Способ:</strong> {withdrawal.withdrawal_details?.method || 'Не указан'}</div>
                                <div><strong>Реквизиты:</strong> {withdrawal.withdrawal_details?.details || 'Не указаны'}</div>
                                {withdrawal.withdrawal_details?.description && (
                                  <div><strong>Комментарий:</strong> {withdrawal.withdrawal_details.description}</div>
                                )}
                                <div><strong>Статус:</strong> {getStatusBadge(withdrawal.status)}</div>
                              </div>

                              {withdrawal.status === 'pending' && (
                                <>
                                  <div>
                                    <Label htmlFor="transferDetails">Детали перевода (необязательно)</Label>
                                    <Textarea
                                      id="transferDetails"
                                      placeholder="Номер транзакции, время выполнения и т.д."
                                      value={transferDetails}
                                      onChange={(e) => setTransferDetails(e.target.value)}
                                      rows={3}
                                    />
                                  </div>
                                </>
                              )}
                            </div>

                            {withdrawal.status === 'pending' && (
                              <DialogFooter className="gap-2">
                                <Button
                                  variant="destructive"
                                  onClick={() => processWithdrawal(withdrawal.id, 'rejected')}
                                  disabled={processing === withdrawal.id}
                                >
                                  Отклонить
                                </Button>
                                <Button
                                  onClick={() => processWithdrawal(withdrawal.id, 'completed')}
                                  disabled={processing === withdrawal.id}
                                >
                                  {processing === withdrawal.id ? "Обработка..." : "Выполнить"}
                                </Button>
                              </DialogFooter>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}