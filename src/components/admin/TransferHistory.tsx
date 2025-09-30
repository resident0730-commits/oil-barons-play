import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Transfer {
  id: string;
  from_user_id: string;
  to_user_id: string;
  amount: number;
  description: string;
  transfer_type: string;
  status?: string;
  created_at: string;
  from_nickname?: string;
  to_nickname?: string;
  withdrawal_details?: any;
}

export function TransferHistory() {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);

  const loadTransfers = async () => {
    if (!user) return;

    try {
      // Get all transfers as admin
      const { data: transfersData, error } = await supabase
        .from('money_transfers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Get profile names for each transfer
      const transfersWithNames = await Promise.all(
        (transfersData || []).map(async (transfer) => {
          const [fromProfile, toProfile] = await Promise.all([
            supabase
              .from('profiles')
              .select('nickname')
              .eq('user_id', transfer.from_user_id)
              .single(),
            supabase
              .from('profiles')
              .select('nickname')
              .eq('user_id', transfer.to_user_id)
              .single()
          ]);

          return {
            ...transfer,
            from_nickname: fromProfile.data?.nickname,
            to_nickname: toProfile.data?.nickname
          };
        })
      );

      setTransfers(transfersWithNames);
    } catch (error) {
      console.error('Error loading transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransfers();
  }, [user]);

  const getTransferIcon = (transfer: Transfer) => {
    if (transfer.transfer_type === 'withdrawal') {
      return <ArrowUp className="h-4 w-4 text-red-500" />;
    }
    if (transfer.from_user_id === user?.id) {
      return <ArrowUp className="h-4 w-4 text-orange-500" />;
    }
    if (transfer.to_user_id === user?.id) {
      return <ArrowDown className="h-4 w-4 text-green-500" />;
    }
    return <ArrowUpDown className="h-4 w-4 text-blue-500" />;
  };

  const getTransferType = (transfer: Transfer) => {
    if (transfer.transfer_type === 'withdrawal') {
      if (transfer.status === 'completed') {
        return { label: 'Вывод выполнен', variant: 'default' as const };
      } else if (transfer.status === 'rejected') {
        return { label: 'Вывод отклонен', variant: 'destructive' as const };
      } else {
        return { label: 'Заявка на вывод', variant: 'secondary' as const };
      }
    }
    if (transfer.from_user_id === user?.id && transfer.to_user_id === user?.id) {
      return { label: 'Самоперевод', variant: 'secondary' as const };
    }
    if (transfer.from_user_id === user?.id) {
      return { label: 'Исходящий', variant: 'outline' as const };
    }
    if (transfer.to_user_id === user?.id) {
      return { label: 'Входящий', variant: 'default' as const };
    }
    return { label: 'Админ', variant: 'secondary' as const };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            История переводов
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          История переводов ({transfers.length})
        </CardTitle>
        <Button variant="outline" size="sm" onClick={loadTransfers}>
          Обновить
        </Button>
      </CardHeader>
      <CardContent>
        {transfers.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            История переводов пуста
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>От кого</TableHead>
                  <TableHead>Кому</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Дата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.map((transfer) => {
                  const transferType = getTransferType(transfer);
                  return (
                    <TableRow 
                      key={transfer.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedTransfer(transfer)}
                    >
                      <TableCell>
                        {getTransferIcon(transfer)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={transferType.variant}>
                          {transferType.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        игровая платформа «Oil Tycoon»
                      </TableCell>
                      <TableCell>
                        {transfer.to_nickname || 'Система'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transfer.amount.toLocaleString()} ₽
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {transfer.description}
                      </TableCell>
                      <TableCell>
                        {new Date(transfer.created_at).toLocaleString('ru-RU')}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Transfer Details Dialog */}
      <Dialog open={!!selectedTransfer} onOpenChange={() => setSelectedTransfer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Детали перевода</DialogTitle>
          </DialogHeader>
          {selectedTransfer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Номер чека</p>
                  <p className="font-medium">{selectedTransfer.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Тип операции</p>
                  <Badge variant={getTransferType(selectedTransfer).variant}>
                    {getTransferType(selectedTransfer).label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">От кого</p>
                  <p className="font-medium">игровая платформа «Oil Tycoon»</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Кому</p>
                  <p className="font-medium">{selectedTransfer.to_nickname || 'Система'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Сумма</p>
                  <p className="font-medium text-lg">{selectedTransfer.amount.toLocaleString()} ₽</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Статус</p>
                  <p className="font-medium">{selectedTransfer.status || 'completed'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Описание</p>
                  <p className="font-medium">{selectedTransfer.description || 'Нет описания'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Дата создания</p>
                  <p className="font-medium">
                    {new Date(selectedTransfer.created_at).toLocaleString('ru-RU')}
                  </p>
                </div>
                {selectedTransfer.transfer_type === 'withdrawal' && selectedTransfer.withdrawal_details && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Способ вывода</p>
                      <p className="font-medium">
                        {(selectedTransfer.withdrawal_details as any)?.method || 'Не указан'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Реквизиты</p>
                      <p className="font-medium">
                        {(selectedTransfer.withdrawal_details as any)?.details || 'Не указаны'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}