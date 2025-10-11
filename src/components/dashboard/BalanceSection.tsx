import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Wallet, 
  CreditCard,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { useGameData } from "@/hooks/useGameData";
import { useCurrency } from "@/hooks/useCurrency";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PaymentHistory } from "@/components/dashboard/PaymentHistory";
import { WithdrawalHistory } from "@/components/dashboard/WithdrawalHistory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BalanceSectionProps {
  onTopUp: (customAmount?: number, packageData?: any, paymentMethod?: string) => Promise<void>;
  topUpLoading?: boolean;
}

interface TopUpPackage {
  id: string;
  name: string;
  rubAmount: number;
  baseOC: number;
  bonusOC: number;
  totalOC: number;
  badge: string | null;
  popular: boolean;
  bonusPercent: number;
}

const topUpPackages: TopUpPackage[] = [
  {
    id: 'mega_bonus',
    name: '🚀 Мега бонус!',
    rubAmount: 10000,
    baseOC: 10000,
    bonusOC: 10000,
    totalOC: 20000,
    badge: '100% БОНУС',
    popular: true,
    bonusPercent: 100
  },
  {
    id: 'premium_plus',
    name: 'Премиум+',
    rubAmount: 5000,
    baseOC: 5000,
    bonusOC: 1000,
    totalOC: 6000,
    badge: '+20%',
    popular: false,
    bonusPercent: 20
  },
  {
    id: 'advanced',
    name: 'Продвинутый',
    rubAmount: 4000,
    baseOC: 4000,
    bonusOC: 600,
    totalOC: 4600,
    badge: '+15%',
    popular: false,
    bonusPercent: 15
  },
  {
    id: 'standard_3k',
    name: 'Стандарт+',
    rubAmount: 3000,
    baseOC: 3000,
    bonusOC: 300,
    totalOC: 3300,
    badge: '+10%',
    popular: false,
    bonusPercent: 10
  },
  {
    id: 'standard_2k',
    name: 'Стандарт',
    rubAmount: 2000,
    baseOC: 2000,
    bonusOC: 200,
    totalOC: 2200,
    badge: '+10%',
    popular: false,
    bonusPercent: 10
  },
  {
    id: 'basic',
    name: 'Базовый',
    rubAmount: 1000,
    baseOC: 1000,
    bonusOC: 0,
    totalOC: 1000,
    badge: null,
    popular: false,
    bonusPercent: 0
  }
];

export const BalanceSection = ({ onTopUp, topUpLoading = false }: BalanceSectionProps) => {
  const { profile } = useGameData();
  const { user } = useAuth();
  const { formatGameCurrency } = useCurrency();
  const { toast } = useToast();
  
  // Top-up form states
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('robokassa');
  const [promoCode, setPromoCode] = useState<string>('');
  
  // Withdrawal form states
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>('');
  const [withdrawalMethod, setWithdrawalMethod] = useState<string>('');
  const [withdrawalDetails, setWithdrawalDetails] = useState<string>('');
  const [withdrawalDescription, setWithdrawalDescription] = useState<string>('');
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);

  const handleWithdrawal = async () => {
    if (!user || !profile) return;
    
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Ошибка",
        description: "Введите корректную сумму для вывода",
        variant: "destructive",
      });
      return;
    }

    if (amount > profile.balance) {
      toast({
        title: "Недостаточно средств",
        description: "На вашем балансе недостаточно средств для вывода",
        variant: "destructive",
      });
      return;
    }

    if (!withdrawalMethod || !withdrawalDetails) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    setWithdrawalLoading(true);
    try {
      // Create withdrawal record
      const { error: transferError } = await supabase
        .from('money_transfers')
        .insert({
          from_user_id: user.id,
          to_user_id: user.id,
          amount: amount,
          description: `Вывод средств (${withdrawalMethod}): ${withdrawalDetails}${withdrawalDescription ? ` - ${withdrawalDescription}` : ''}`,
          transfer_type: 'withdrawal',
          created_by: user.id,
          status: 'pending',
          withdrawal_details: {
            method: withdrawalMethod,
            details: withdrawalDetails,
            description: withdrawalDescription
          }
        });

      if (transferError) throw transferError;

      // Deduct balance
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          balance: profile.balance - amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Заявка на вывод создана",
        description: `Заявка на вывод ${amount.toLocaleString()} ₽ создана успешно`,
      });

      // Reset form
      setWithdrawalAmount('');
      setWithdrawalMethod('');
      setWithdrawalDetails('');
      setWithdrawalDescription('');
      
      // Reload profile to update balance
      window.location.reload();
    } catch (error: any) {
      console.error('Error creating withdrawal:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать заявку на вывод",
        variant: "destructive",
      });
    } finally {
      setWithdrawalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Wallet className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold">Баланс и пополнение</h2>
          <p className="text-muted-foreground">Управляйте средствами и историей операций</p>
        </div>
      </div>

      {/* Current Balance */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Текущий баланс</p>
              <p className="text-4xl font-bold text-primary">
                {formatGameCurrency(profile?.balance || 0)}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-500 font-medium">Активен</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Доступно для использования
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Up Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Пополнение баланса</span>
          </CardTitle>
          <CardDescription>
            Выберите пакет или введите сумму для пополнения
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Packages */}
          <div className="space-y-3">
            <Label>Выберите пакет</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {topUpPackages.map((pkg) => (
                <div
                  key={pkg.name}
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setCustomAmount('');
                  }}
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                    selectedPackage?.name === pkg.name
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-semibold">{pkg.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {pkg.rubAmount} ₽ = {pkg.totalOC.toLocaleString()} OC
                  </div>
                  {pkg.bonusPercent > 0 && (
                    <div className="text-xs text-green-600 mt-1">
                      +{pkg.bonusPercent}% бонус!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <Label htmlFor="custom-amount">Или введите свою сумму (₽)</Label>
            <Input
              id="custom-amount"
              type="number"
              placeholder="Минимум 10 ₽"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedPackage(null);
              }}
              min="10"
            />
          </div>

          {/* Promo Code */}
          <div className="space-y-2">
            <Label htmlFor="promo-code">Промокод (необязательно)</Label>
            <Input
              id="promo-code"
              type="text"
              placeholder="Введите промокод..."
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            />
            <p className="text-xs text-muted-foreground">
              Промокод применится автоматически после успешной оплаты
            </p>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="payment-method">Способ оплаты</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="payment-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="robokassa">Robokassa (Карты, СБП)</SelectItem>
                <SelectItem value="yookassa">YooKassa</SelectItem>
                <SelectItem value="tbank">Т-Банк</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={() => {
              if (selectedPackage) {
                onTopUp(undefined, selectedPackage, paymentMethod);
              } else if (customAmount) {
                onTopUp(parseFloat(customAmount), undefined, paymentMethod);
              }
            }}
            disabled={topUpLoading || (!customAmount && !selectedPackage)}
            className="w-full"
            size="lg"
          >
            {topUpLoading ? 'Обработка...' : 'Перейти к оплате'}
          </Button>
        </CardContent>
      </Card>

      {/* Withdrawal Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Вывод средств</span>
          </CardTitle>
          <CardDescription>
            Оставьте заявку на вывод средств с вашего баланса
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="withdrawal-amount">Сумма вывода (₽)</Label>
            <Input
              id="withdrawal-amount"
              type="number"
              placeholder="Введите сумму..."
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              min="1"
            />
            {profile && withdrawalAmount && parseFloat(withdrawalAmount) > profile.balance && (
              <p className="text-sm text-destructive">
                Недостаточно средств. Доступно: {formatGameCurrency(profile.balance)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawal-method">Способ вывода</Label>
            <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
              <SelectTrigger id="withdrawal-method">
                <SelectValue placeholder="Выберите способ вывода" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Банковская карта</SelectItem>
                <SelectItem value="yoomoney">ЮMoney</SelectItem>
                <SelectItem value="qiwi">QIWI</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawal-details">Реквизиты для вывода</Label>
            <Input
              id="withdrawal-details"
              placeholder="Номер карты, кошелька и т.д."
              value={withdrawalDetails}
              onChange={(e) => setWithdrawalDetails(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawal-description">Комментарий (необязательно)</Label>
            <Textarea
              id="withdrawal-description"
              placeholder="Дополнительная информация..."
              value={withdrawalDescription}
              onChange={(e) => setWithdrawalDescription(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={handleWithdrawal}
            disabled={withdrawalLoading || !withdrawalAmount || !withdrawalMethod || !withdrawalDetails}
            className="w-full"
          >
            {withdrawalLoading ? 'Обработка...' : 'Создать заявку на вывод'}
          </Button>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments">История пополнений</TabsTrigger>
          <TabsTrigger value="withdrawals">История выводов</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payments" className="mt-6">
          <PaymentHistory />
        </TabsContent>
        
        <TabsContent value="withdrawals" className="mt-6">
          <WithdrawalHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};
