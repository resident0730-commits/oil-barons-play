import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, DollarSign } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGameData } from '@/hooks/useGameData';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function MoneyWithdrawal() {
  const { user } = useAuth();
  const { profile, reload } = useGameData();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [details, setDetails] = useState('');
  const [description, setDescription] = useState('');

  const handleWithdrawal = async () => {
    if (!user || !profile) return;
    
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast({
        title: "Ошибка",
        description: "Введите корректную сумму для вывода",
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmount > profile.balance) {
      toast({
        title: "Недостаточно средств",
        description: "На вашем балансе недостаточно средств для вывода",
        variant: "destructive",
      });
      return;
    }

    if (!method || !details) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create withdrawal record
      const { error: transferError } = await supabase
        .from('money_transfers')
        .insert({
          from_user_id: user.id,
          to_user_id: user.id, // Self-transfer for withdrawal
          amount: withdrawAmount,
          description: `Вывод средств (${method}): ${details}${description ? ` - ${description}` : ''}`,
          transfer_type: 'withdrawal',
          created_by: user.id,
          status: 'pending',
          withdrawal_details: {
            method: method,
            details: details,
            description: description
          }
        });

      if (transferError) throw transferError;

      // Deduct balance
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          balance: profile.balance - withdrawAmount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await reload();
      
      toast({
        title: "Заявка на вывод создана",
        description: `Заявка на вывод ${withdrawAmount.toLocaleString()} ₽ создана успешно`,
      });

      // Reset form
      setAmount('');
      setMethod('');
      setDetails('');
      setDescription('');
      setOpen(false);
    } catch (error: any) {
      console.error('Error creating withdrawal:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать заявку на вывод",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Вывод средств
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Вывод средств
          </DialogTitle>
          <DialogDescription>
            Доступно для вывода: {profile?.balance.toLocaleString()} ₽
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Сумма для вывода *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Введите сумму в рублях"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max={profile?.balance || 0}
            />
          </div>

          <div>
            <Label htmlFor="method">Способ вывода *</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите способ вывода" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Банковская карта</SelectItem>
                <SelectItem value="qiwi">QIWI кошелек</SelectItem>
                <SelectItem value="yoomoney">ЮMoney</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="crypto">Криптовалюта</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="details">Реквизиты *</Label>
            <Input
              id="details"
              placeholder="Номер карты, кошелька или адрес"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Комментарий</Label>
            <Textarea
              id="description"
              placeholder="Дополнительная информация (необязательно)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button onClick={handleWithdrawal} disabled={loading}>
            {loading ? "Создание заявки..." : "Создать заявку"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}