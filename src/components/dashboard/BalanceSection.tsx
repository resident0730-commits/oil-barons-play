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
            Выберите сумму для пополнения или готовые пакеты с бонусами
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Promo Code Card */}
          <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="p-4">
              <div className="space-y-2">
                <Label htmlFor="promo-code" className="text-sm font-semibold flex items-center gap-2">
                  💎 Есть промокод?
                </Label>
                <p className="text-xs text-muted-foreground">
                  Введите промокод сейчас - он будет применен автоматически после успешной оплаты
                </p>
                <Input
                  id="promo-code"
                  type="text"
                  placeholder="Введите промокод (необязательно)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Custom Amount */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Label htmlFor="custom-amount" className="text-sm">Произвольная сумма (мин. 10 ₽)</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="10"
                    min="10"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedPackage(null);
                    }}
                    className="text-sm"
                  />
                  <Button 
                    onClick={() => {
                      const amount = parseFloat(customAmount);
                      if (amount >= 10) {
                        onTopUp(amount, undefined, paymentMethod);
                      }
                    }}
                    disabled={!customAmount || parseFloat(customAmount) < 10 || topUpLoading}
                    size="sm"
                  >
                    Пополнить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Offer */}
          <div>
            <h3 className="text-sm font-bold mb-3 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              🔥 Особое предложение
            </h3>
            
            {topUpPackages.filter(pkg => pkg.popular).map((pkg) => (
              <Card 
                key={pkg.id} 
                className="relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/25 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-2 border-primary/30 hover:border-primary/50 overflow-hidden group"
                onClick={() => {
                  setSelectedPackage(pkg);
                  setCustomAmount('');
                  onTopUp(undefined, pkg, paymentMethod);
                }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/20 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform"></div>
                
                <CardContent className="p-6 relative z-10">
                  <div className="text-center space-y-6">
                    <div className="space-y-2">
                      <h4 className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {pkg.name}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Удвойте свои инвестиции прямо сейчас!
                      </p>
                    </div>
                    
                    <div className="bg-card/70 rounded-xl p-6 border border-primary/20">
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className="text-center space-y-1">
                          <div className="text-sm text-muted-foreground">Вы платите</div>
                          <div className="text-2xl font-bold text-primary">
                            {pkg.rubAmount} ₽
                          </div>
                        </div>
                        
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                          →
                        </div>
                        
                        <div className="text-center space-y-1">
                          <div className="text-sm text-muted-foreground">Вы получаете</div>
                          <div className="text-3xl font-bold text-accent">
                            {formatGameCurrency(pkg.totalOC)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center space-y-2">
                        <div className="text-sm text-muted-foreground">
                          <span className="line-through">{formatGameCurrency(pkg.baseOC)}</span>
                          <span className="ml-2 text-accent font-bold">+ {formatGameCurrency(pkg.bonusOC)} БОНУС</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      size="lg"
                      disabled={topUpLoading}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 text-white shadow-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPackage(pkg);
                        setCustomAmount('');
                        onTopUp(undefined, pkg, paymentMethod);
                      }}
                    >
                      {topUpLoading ? 'Обработка...' : 'Получить удвоенный бонус'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Regular Packages */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Другие пакеты пополнения</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {topUpPackages.filter(pkg => !pkg.popular).map((pkg) => (
                <Card 
                  key={pkg.id} 
                  className="relative cursor-pointer transition-all duration-300 hover:shadow-lg"
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setCustomAmount('');
                    onTopUp(undefined, pkg, paymentMethod);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="text-center space-y-3">
                      <h4 className="font-bold text-lg">{pkg.name}</h4>
                      
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-primary">
                          {formatGameCurrency(pkg.totalOC)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {pkg.rubAmount} ₽
                        </div>
                      </div>

                      {pkg.bonusOC > 0 && (
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">
                            {formatGameCurrency(pkg.baseOC)} + {formatGameCurrency(pkg.bonusOC)} бонус
                          </div>
                          {pkg.badge && (
                            <div className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              {pkg.badge}
                            </div>
                          )}
                        </div>
                      )}

                      <Button 
                        disabled={topUpLoading}
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPackage(pkg);
                          setCustomAmount('');
                          onTopUp(undefined, pkg, paymentMethod);
                        }}
                      >
                        {topUpLoading ? 'Обработка...' : 'Выбрать'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
