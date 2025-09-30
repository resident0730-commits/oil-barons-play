import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, CreditCard, User, Check, X } from 'lucide-react';
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
  const [processingId, setProcessingId] = useState<string | null>(null);
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

    setProcessingId(withdrawalId);
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
      setProcessingId(null);
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
                  <TableHead>От кого</TableHead>
                  <TableHead>Игрок</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Способ</TableHead>
                  <TableHead>Реквизиты</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>
                      {getStatusIcon(withdrawal.status)}
                    </TableCell>
                    <TableCell className="font-medium">
                      игровая платформа «Oil Tycoon»
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{withdrawal.from_nickname || 'Неизвестно'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">
                      {withdrawal.amount.toLocaleString()} ₽
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {withdrawal.withdrawal_details?.method || 'Не указан'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {withdrawal.withdrawal_details?.details || 'Не указаны'}
                    </TableCell>
                    <TableCell>
                      {new Date(withdrawal.created_at).toLocaleString('ru-RU')}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(withdrawal.status)}
                    </TableCell>
                    <TableCell>
                      {withdrawal.status === 'pending' ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedWithdrawal(withdrawal)}>
                              Обработать
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Обработка вывода</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Номер чека</p>
                                <p className="font-medium text-xs break-all">{withdrawal.id}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">От кого</p>
                                <p className="font-medium">игровая платформа «Oil Tycoon»</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Пользователь</p>
                                <p className="font-medium">{withdrawal.from_nickname}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Сумма</p>
                                <p className="font-bold text-lg">{withdrawal.amount.toLocaleString()} ₽</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Способ вывода</p>
                                <p className="font-medium">{withdrawal.withdrawal_details?.method}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Реквизиты</p>
                                <p className="font-medium">{withdrawal.withdrawal_details?.details}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Дата создания</p>
                                <p className="font-medium">
                                  {new Date(withdrawal.created_at).toLocaleString('ru-RU')}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm text-muted-foreground">Комментарий к переводу</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border rounded-md"
                                  placeholder="Перевод средств пользователю"
                                  value={transferDetails}
                                  onChange={(e) => setTransferDetails(e.target.value)}
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => {
                                    processWithdrawal(withdrawal.id, 'completed');
                                  }}
                                  disabled={processingId === withdrawal.id}
                                  className="flex-1"
                                >
                                  {processingId === withdrawal.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                      Обработка...
                                    </>
                                  ) : (
                                    <>
                                      <Check className="h-4 w-4 mr-2" />
                                      Одобрить
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    processWithdrawal(withdrawal.id, 'rejected');
                                  }}
                                  disabled={processingId === withdrawal.id}
                                  className="flex-1"
                                >
                                  {processingId === withdrawal.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                      Обработка...
                                    </>
                                  ) : (
                                    <>
                                      <X className="h-4 w-4 mr-2" />
                                      Отклонить
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Детали
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Детали вывода</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Номер чека</p>
                                <p className="font-medium text-xs break-all">{withdrawal.id}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">От кого</p>
                                <p className="font-medium">игровая платформа «Oil Tycoon»</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Пользователь</p>
                                <p className="font-medium">{withdrawal.from_nickname}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Сумма</p>
                                <p className="font-bold text-lg">{withdrawal.amount.toLocaleString()} ₽</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Способ вывода</p>
                                <p className="font-medium">{withdrawal.withdrawal_details?.method}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Реквизиты</p>
                                <p className="font-medium">{withdrawal.withdrawal_details?.details}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Статус</p>
                                {getStatusBadge(withdrawal.status)}
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Дата создания</p>
                                <p className="font-medium">
                                  {new Date(withdrawal.created_at).toLocaleString('ru-RU')}
                                </p>
                              </div>
                            </div>
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