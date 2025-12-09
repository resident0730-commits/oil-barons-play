import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  Wallet, 
  CreditCard,
  QrCode,
  Calendar,
  TrendingUp,
  Check,
  Star,
  Zap,
  Gift,
  ArrowLeft,
  DollarSign,
  Send
} from "lucide-react";
import { useGameData } from "@/hooks/useGameData";
import { useCurrency } from "@/hooks/useCurrency";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { RobokassaWidget } from "@/components/RobokassaWidget";
import qrPaymentImage from "@/assets/qr-payment.png";
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
  onTopUp?: () => void;
  topUpLoading?: boolean;
}

interface TopUpPackage {
  id: string;
  name: string;
  rubAmount: number;
  ocAmount: number;
  bonusOC: number;
  totalOC: number;
  savings: string;
  popular?: boolean;
  special?: boolean;
}

const topUpPackages: TopUpPackage[] = [
  {
    id: 'basic',
    name: 'Базовый',
    rubAmount: 1000,
    ocAmount: 1000,
    bonusOC: 0,
    totalOC: 1000,
    savings: '',
  },
  {
    id: 'standard_2k',
    name: 'Стандарт',
    rubAmount: 2000,
    ocAmount: 2000,
    bonusOC: 200,
    totalOC: 2200,
    savings: '10%',
  },
  {
    id: 'standard_3k',
    name: 'Стандарт+',
    rubAmount: 3000,
    ocAmount: 3000,
    bonusOC: 300,
    totalOC: 3300,
    savings: '10%',
  },
  {
    id: 'advanced',
    name: 'Продвинутый',
    rubAmount: 4000,
    ocAmount: 4000,
    bonusOC: 600,
    totalOC: 4600,
    savings: '15%',
  },
  {
    id: 'premium_plus',
    name: 'Премиум+',
    rubAmount: 5000,
    ocAmount: 5000,
    bonusOC: 1000,
    totalOC: 6000,
    savings: '20%',
    popular: true,
  },
  {
    id: 'elite_6k',
    name: 'Элитный 6К',
    rubAmount: 6000,
    ocAmount: 6000,
    bonusOC: 1260,
    totalOC: 7260,
    savings: '21%',
    popular: false,
  },
  {
    id: 'elite_7k',
    name: 'Элитный 7К',
    rubAmount: 7000,
    ocAmount: 7000,
    bonusOC: 1540,
    totalOC: 8540,
    savings: '22%',
    popular: false,
  },
  {
    id: 'elite_8k',
    name: 'Элитный 8К',
    rubAmount: 8000,
    ocAmount: 8000,
    bonusOC: 1840,
    totalOC: 9840,
    savings: '23%',
    popular: false,
  },
  {
    id: 'mega_bonus',
    name: 'МЕГА БОНУС',
    rubAmount: 10000,
    ocAmount: 10000,
    bonusOC: 10000,
    totalOC: 20000,
    savings: '100%',
    special: true,
  }
];

export const BalanceSection = ({ onTopUp, topUpLoading }: BalanceSectionProps) => {
  const { profile } = useGameData();
  const { user } = useAuth();
  const { formatBarrels, formatOilCoins, formatRubles } = useCurrency();
  const formatGameCurrency = formatOilCoins;
  const formatRealCurrency = formatRubles;
  const { toast } = useToast();
  
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<TopUpPackage | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'robokassa' | 'qr' | null>(null);
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoApplied, setPromoApplied] = useState(false);
  
  // Withdrawal form states
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>('');
  const [withdrawalMethod, setWithdrawalMethod] = useState<string>('');
  const [withdrawalDetails, setWithdrawalDetails] = useState<string>('');
  const [withdrawalDescription, setWithdrawalDescription] = useState<string>('');
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim() || !user) return;

    try {
      const { data, error } = await supabase.rpc('apply_promo_code', {
        p_code: promoCode.trim(),
        p_user_id: user.id,
        p_invoice_id: null
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; message?: string };

      if (result.success) {
        setPromoApplied(true);
        toast({
          title: "Промокод применен!",
          description: result.message,
        });
      } else {
        toast({
          title: "Ошибка",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось применить промокод",
        variant: "destructive"
      });
    }
  };

  // Reset state when needed
  useEffect(() => {
    if (!showPayment) {
      setSelectedPackage(null);
      setPaymentMethod(null);
      setPaymentAmount(0);
    }
  }, [showPayment]);

  const handleCustomTopUp = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount < 1000) {
      toast({
        title: "Некорректная сумма",
        description: "Минимальная сумма пополнения 1000 ₽",
        variant: "destructive"
      });
      return;
    }
    
    setPaymentAmount(amount);
    setShowPayment(true);
  };

  const handlePackageSelect = (pkg: TopUpPackage) => {
    setSelectedPackage(pkg);
    setPaymentAmount(pkg.rubAmount);
    setShowPayment(true);
  };

  const handleBackToPayment = () => {
    setPaymentMethod(null);
  };

  const handleBackToBalance = () => {
    setShowPayment(false);
    setPaymentMethod(null);
    setSelectedPackage(null);
    setPaymentAmount(0);
  };

  const handleWithdrawal = async () => {
    if (!user || !profile) return;
    
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount < 10000) {
      toast({
        title: "Ошибка",
        description: "Минимальная сумма вывода 10000 ₽",
        variant: "destructive",
      });
      return;
    }

    if (amount > profile.ruble_balance) {
      toast({
        title: "Недостаточно средств",
        description: "На вашем балансе недостаточно рублей для вывода",
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

      // Deduct balance from rubles
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          ruble_balance: profile.ruble_balance - amount,
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

  // Render payment method selection
  if (showPayment && !paymentMethod) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleBackToBalance}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Способ оплаты</h2>
            <p className="text-muted-foreground">
              К оплате: {formatRealCurrency(paymentAmount)}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-primary/20" 
                onClick={() => setPaymentMethod('robokassa')}>
            <CardContent className="p-6 text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-2">Robokassa</h3>
              <p className="text-sm text-muted-foreground">Банковские карты, электронные кошельки</p>
              <Badge variant="secondary" className="mt-2">Рекомендуется</Badge>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-primary/20"
                onClick={() => setPaymentMethod('qr')}>
            <CardContent className="p-6 text-center">
              <QrCode className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-2">QR-код</h3>
              <p className="text-sm text-muted-foreground">Сканирование QR-кода</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render Robokassa payment
  if (showPayment && paymentMethod === 'robokassa') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleBackToPayment}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Оплата через Robokassa</h2>
            <p className="text-muted-foreground">
              К оплате: {formatRealCurrency(paymentAmount)}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <RobokassaWidget
              amount={paymentAmount}
              totalAmount={selectedPackage?.totalOC || paymentAmount}
              onSuccess={() => {
                toast({
                  title: "Успешно!",
                  description: "Платеж обрабатывается",
                });
                handleBackToBalance();
              }}
              onError={(error) => {
                toast({
                  title: "Ошибка",
                  description: error,
                  variant: "destructive",
                });
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render QR payment
  if (showPayment && paymentMethod === 'qr') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleBackToPayment}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Оплата по QR-коду</h2>
            <p className="text-muted-foreground">
              К оплате: {formatRealCurrency(paymentAmount)}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="max-w-md mx-auto">
              <img 
                src={qrPaymentImage} 
                alt="QR код для оплаты" 
                className="w-full max-w-xs mx-auto mb-4 rounded-lg border"
              />
              <h3 className="font-semibold text-lg mb-2">Отсканируйте QR-код</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Используйте приложение банка для сканирования QR-кода и совершения платежа
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Сумма к оплате:</strong> {formatRealCurrency(paymentAmount)}
                </p>
                {selectedPackage && (
                  <p className="text-sm">
                    <strong>Вы получите:</strong> {formatGameCurrency(selectedPackage.totalOC)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main balance section with tabs
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Wallet className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold">Управление балансом</h2>
          <p className="text-muted-foreground">Баланс, пополнение и вывод средств</p>
        </div>
      </div>

      <Tabs defaultValue="balance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="balance">Баланс</TabsTrigger>
          <TabsTrigger value="deposit">Пополнение</TabsTrigger>
          <TabsTrigger value="withdrawal">Вывод</TabsTrigger>
        </TabsList>

        {/* BALANCE TAB */}
        <TabsContent value="balance" className="space-y-6 mt-6">
          {/* Three Currency Balances */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Barrels Balance */}
            <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">BBL</Badge>
                  <TrendingUp className="h-5 w-5 text-amber-500" />
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Barrels</p>
                <p className="text-3xl font-bold text-amber-400">
                  {formatBarrels(profile?.barrel_balance || 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Производственная валюта
                </p>
              </CardContent>
            </Card>

            {/* OilCoins Balance */}
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">OC</Badge>
                  <Wallet className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">OilCoins</p>
                <p className="text-3xl font-bold text-green-400">
                  {formatOilCoins(profile?.oilcoin_balance || 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Основная игровая валюта
                </p>
              </CardContent>
            </Card>

            {/* Rubles Balance */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">₽</Badge>
                  <DollarSign className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Rubles</p>
                <p className="text-3xl font-bold text-blue-400">
                  {formatRubles(profile?.ruble_balance || 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Премиум валюта
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Balance Overview Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Информация о валютах</span>
              </CardTitle>
              <CardDescription>
                Назначение каждого типа валюты
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• <strong>Barrels (BBL)</strong> - производственная валюта для покупки скважин</li>
                  <li>• <strong>OilCoins (OC)</strong> - основная игровая валюта для улучшений</li>
                  <li>• <strong>Rubles (₽)</strong> - премиум валюта для вывода средств</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DEPOSIT TAB */}
        <TabsContent value="deposit" className="space-y-6 mt-6">
          {/* PROMO CODE SECTION */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent backdrop-blur-xl border-2 border-green-500/50 hover:border-green-400 transition-all duration-500 hover:-translate-y-2 animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-green-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-green-400/40 transition-all duration-500"></div>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center space-x-2 text-green-100 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                <div className="p-2 bg-green-500/30 rounded-xl backdrop-blur-sm">
                  <Gift className="h-5 w-5 text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                </div>
                <span>У вас есть промокод?</span>
              </CardTitle>
              <CardDescription className="text-green-50/80">
                Введите промокод для получения бонуса на баланс
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              {!promoApplied ? (
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Введите промокод"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="text-base bg-background/50 backdrop-blur-sm border-green-500/30 focus:border-green-400"
                    />
                  </div>
                  <Button 
                    onClick={handleApplyPromoCode}
                    disabled={!promoCode.trim()}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/50 transition-all duration-300"
                  >
                    Применить
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-400/40 rounded-lg backdrop-blur-sm">
                  <Gift className="h-5 w-5 text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                  <span className="text-green-100 font-medium">Промокод успешно применен!</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Custom Amount Input */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent backdrop-blur-xl border-2 border-blue-500/50 hover:border-blue-400 transition-all duration-500 hover:-translate-y-2 animate-fade-in animation-delay-100">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-blue-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-blue-400/40 transition-all duration-500"></div>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-100"></div>
            </div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center space-x-2 text-blue-100 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                <div className="p-2 bg-blue-500/30 rounded-xl backdrop-blur-sm">
                  <CreditCard className="h-5 w-5 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                </div>
                <span>Произвольная сумма</span>
              </CardTitle>
              <CardDescription className="text-blue-50/80">
                Пополнение в OilCoins (1₽ = 1 OC). Минимальная сумма — 1000 OC
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="custom-amount" className="text-blue-100">Сумма в OilCoins (минимум 1000 OC)</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Введите сумму от 1000 OC..."
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    min="1000"
                    className="mt-1 bg-background/50 backdrop-blur-sm border-blue-500/30 focus:border-blue-400"
                  />
                  {customAmount && parseFloat(customAmount) >= 1000 && (
                    <p className="text-sm text-blue-200/80 mt-1">
                      К оплате: {parseFloat(customAmount).toLocaleString()} ₽ → {parseFloat(customAmount).toLocaleString()} OC
                    </p>
                  )}
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleCustomTopUp}
                    disabled={!customAmount || parseFloat(customAmount) < 1000 || topUpLoading}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                  >
                    Пополнить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Offer */}
          <div className="relative animate-fade-in animation-delay-200">
            {/* Glowing background effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-2xl blur-2xl opacity-60 group-hover:opacity-75 transition-opacity"></div>
            
            <Card className="relative group overflow-hidden border-2 border-primary/50 hover:border-primary transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-primary/40 transition-all duration-500"></div>
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-accent/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-accent/40 transition-all duration-500"></div>
              
              {/* Premium badge with enhanced glow */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-primary to-accent text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-lg shadow-xl shadow-primary/60 animate-fade-in z-10">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                <span className="drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">ПРЕМИУМ ПРЕДЛОЖЕНИЕ</span>
              </div>

              {/* Animated shine overlay */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>

              <CardHeader className="relative z-10 p-3 sm:p-6">
                <CardTitle className="flex items-center space-x-2 sm:space-x-3 text-xl sm:text-3xl font-bold">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-primary to-accent rounded-lg shadow-lg">
                    <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  </div>
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-lg">
                    Особое предложение
                  </span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-lg text-foreground/80 drop-shadow-sm">
                  Удвойте свой бонус с максимальной выгодой
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10 p-3 sm:p-6">
                <div 
                  className="cursor-pointer group"
                  onClick={() => handlePackageSelect(topUpPackages[8])}
                >
                  <div className="bg-gradient-to-br from-card/90 to-primary/20 p-4 sm:p-8 rounded-2xl border-2 border-primary/40 group-hover:border-primary/70 group-hover:shadow-2xl group-hover:shadow-primary/30 transition-all duration-500 relative overflow-hidden backdrop-blur-sm">
                    
                    {/* Enhanced hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/15 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="text-center space-y-4 sm:space-y-6 relative z-10">
                      {/* Enhanced offer badge */}
                      <div className="inline-flex items-center bg-gradient-to-r from-primary via-accent to-primary text-white py-2 px-4 sm:py-3 sm:px-8 rounded-full font-bold text-sm sm:text-xl shadow-xl shadow-primary/60 group-hover:shadow-2xl group-hover:shadow-primary/80 transition-all duration-300">
                        <Gift className="h-3 w-3 sm:h-5 sm:w-5 mr-1 sm:mr-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
                        <span className="hidden sm:inline drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">x2 УДВОЕНИЕ БОНУСА</span>
                        <span className="sm:hidden drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">x2 БОНУС</span>
                        <TrendingUp className="h-3 w-3 sm:h-5 sm:w-5 ml-1 sm:ml-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
                      </div>
                      
                       <p className="text-sm sm:text-xl font-semibold text-foreground px-2">
                         Пополните счет — получите в два раза больше
                       </p>
                      
                      {/* Comparison */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
                        <div className="text-center bg-gradient-to-br from-card to-muted/20 p-3 sm:p-6 rounded-xl border border-border shadow-md group-hover:shadow-lg transition-shadow duration-300">
                          <div className="text-primary mb-2">
                            <Wallet className="h-5 w-5 sm:h-6 sm:w-6 mx-auto" />
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Вы пополняете</p>
                          <p className="text-lg sm:text-2xl font-bold text-foreground">10 000 ₽</p>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center">
                           <div className="bg-gradient-to-r from-primary to-accent text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-base sm:text-lg shadow-md">
                             ×2
                           </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium">Бонус</p>
                        </div>
                        
                        <div className="text-center bg-gradient-to-br from-primary/10 to-accent/10 p-3 sm:p-6 rounded-xl border border-primary/30 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                          <div className="text-primary mb-2">
                            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 mx-auto" />
                          </div>
                           <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Вы получаете</p>
                           <p className="text-lg sm:text-2xl font-bold text-primary">20 000 OC</p>
                        </div>
                      </div>
                      
                      {/* Benefits with improved readability and symmetry */}
                      <div className="bg-gradient-to-r from-muted/50 to-primary/10 p-3 sm:p-6 rounded-xl border border-primary/20 backdrop-blur-sm">
                        <div className="grid grid-cols-3 gap-4 sm:gap-6 text-xs sm:text-sm">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-green-500/40">
                              <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                            </div>
                            <span className="font-semibold text-green-100 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] text-center">Выгода 100%</span>
                          </div>
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-500/40">
                              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
                            </div>
                            <span className="font-semibold text-blue-100 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] text-center">Мгновенно</span>
                          </div>
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-500/40">
                              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                            </div>
                            <span className="font-semibold text-purple-100 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] text-center">Без комиссий</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* CTA button */}
                      <Button 
                        className="group relative overflow-hidden text-sm sm:text-lg font-bold py-3 px-6 sm:py-6 sm:px-10 bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:via-accent hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl w-full max-w-md mx-auto"
                        size="lg"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        
                        <div className="relative flex items-center justify-center space-x-2 sm:space-x-3">
                          <Gift className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="whitespace-nowrap">
                            <span className="hidden sm:inline">Получить удвоенный бонус</span>
                            <span className="sm:hidden">Получить x2 бонус</span>
                          </span>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </Button>
                      
                      {/* Notice with updated styling */}
                      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 backdrop-blur-sm border border-primary/30 p-3 sm:p-4 rounded-xl shadow-lg">
                        <div className="flex items-center justify-center space-x-2">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)]" />
                          <span className="font-semibold text-xs sm:text-sm text-center bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-sm">
                            <span className="hidden sm:inline">Эксклюзивное предложение • Ограниченное время</span>
                            <span className="sm:hidden">Ограниченное время</span>
                          </span>
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regular Packages */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent backdrop-blur-xl border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-500 hover:-translate-y-2 animate-fade-in animation-delay-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-purple-400/40 transition-all duration-500"></div>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-200"></div>
            </div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center space-x-2 text-purple-100 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                <div className="p-2 bg-purple-500/30 rounded-xl backdrop-blur-sm">
                  <Gift className="h-5 w-5 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                </div>
                <span>Готовые пакеты</span>
              </CardTitle>
              <CardDescription className="text-purple-50/80">
                Выберите один из готовых пакетов для быстрого пополнения
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {topUpPackages.slice(0, -1).map((pkg, index) => (
                    <div
                      key={pkg.id}
                      className={`
                        relative cursor-pointer group transition-all duration-500 hover:shadow-xl
                        p-3 sm:p-4 rounded-lg border-2 overflow-hidden backdrop-blur-sm
                        ${pkg.popular 
                          ? 'border-primary/50 bg-gradient-to-br from-primary/20 to-accent/10 hover:border-primary' 
                          : 'border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent hover:border-purple-400'
                        }
                        hover:-translate-y-1 animate-fade-in
                      `}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => handlePackageSelect(pkg)}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                          <Badge variant="default" className="bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg shadow-primary/50 text-xs">
                            Популярный
                          </Badge>
                        </div>
                      )}
                      
                      {/* Decorative blur effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </div>

                      <div className="text-center space-y-2 sm:space-y-3 relative z-10">
                        <h3 className="font-semibold text-base sm:text-lg drop-shadow-sm truncate">{pkg.name}</h3>
                        
                        <div className="space-y-1 sm:space-y-2">
                          <p className="text-xl sm:text-2xl font-bold text-primary drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]">
                            {formatRealCurrency(pkg.rubAmount)}
                          </p>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs sm:text-sm">
                              <span className="text-muted-foreground truncate">Базовая сумма:</span>
                              <span className="ml-1 flex-shrink-0">{formatGameCurrency(pkg.ocAmount)}</span>
                            </div>
                            
                            {pkg.bonusOC > 0 && (
                              <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-muted-foreground truncate">Бонус:</span>
                                <span className="text-green-600 font-medium ml-1 flex-shrink-0">
                                  +{formatGameCurrency(pkg.bonusOC)}
                                </span>
                              </div>
                            )}
                            
                            <Separator />
                            
                            <div className="flex justify-between font-medium text-xs sm:text-sm">
                              <span className="truncate">Итого:</span>
                              <span className="text-primary ml-1 flex-shrink-0">{formatGameCurrency(pkg.totalOC)}</span>
                            </div>
                          </div>
                        </div>

                        {pkg.savings && (
                          <Badge variant="secondary" className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30 shadow-sm text-xs">
                            Экономия {pkg.savings}
                          </Badge>
                        )}

                        <Button 
                          className="w-full group-hover:shadow-lg transition-all duration-300 shadow-md text-xs sm:text-sm"
                          variant={pkg.popular ? "default" : "outline"}
                          disabled={topUpLoading}
                          size="sm"
                        >
                          <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Выбрать пакет
                        </Button>
                      </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent backdrop-blur-xl border-2 border-orange-500/50 hover:border-orange-400 transition-all duration-500 hover:-translate-y-2 animate-fade-in animation-delay-400">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-orange-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-orange-400/40 transition-all duration-500"></div>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-300"></div>
            </div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center space-x-2 text-orange-100 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                <div className="p-2 bg-orange-500/30 rounded-xl backdrop-blur-sm">
                  <Calendar className="h-5 w-5 text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                </div>
                <span>История пополнений</span>
              </CardTitle>
              <CardDescription className="text-orange-50/80">
                Последние пополнения вашего счета
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 relative">
              <PaymentHistory />
            </CardContent>
          </Card>
        </TabsContent>

        {/* WITHDRAWAL TAB */}
        <TabsContent value="withdrawal" className="space-y-6 mt-6">
          {/* Withdrawal Form */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent backdrop-blur-xl border-2 border-red-500/50 hover:border-red-400 transition-all duration-500 hover:-translate-y-2 animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-red-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-red-400/40 transition-all duration-500"></div>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center space-x-2 text-red-100 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                <div className="p-2 bg-red-500/30 rounded-xl backdrop-blur-sm">
                  <Send className="h-5 w-5 text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                </div>
                <span>Вывод средств</span>
              </CardTitle>
              <CardDescription className="text-red-50/80">
                Создайте заявку на вывод средств (минимум 10000 ₽). Доступно для вывода: {formatRubles(profile?.ruble_balance || 0)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="withdrawal-amount" className="text-red-100">Сумма для вывода * (минимум 10000 ₽)</Label>
                  <Input
                    id="withdrawal-amount"
                    type="number"
                    placeholder="Введите сумму от 10000 ₽"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    min="10000"
                    max={profile?.ruble_balance || 0}
                    className="mt-1 bg-background/50 backdrop-blur-sm border-red-500/30 focus:border-red-400"
                  />
                </div>

                <div>
                  <Label htmlFor="withdrawal-method" className="text-red-100">Способ вывода *</Label>
                  <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                    <SelectTrigger className="mt-1 bg-background/50 backdrop-blur-sm border-red-500/30 focus:border-red-400">
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
              </div>

              <div>
                <Label htmlFor="withdrawal-details" className="text-red-100">Реквизиты *</Label>
                <Input
                  id="withdrawal-details"
                  placeholder="Номер карты, кошелька или адрес"
                  value={withdrawalDetails}
                  onChange={(e) => setWithdrawalDetails(e.target.value)}
                  className="mt-1 bg-background/50 backdrop-blur-sm border-red-500/30 focus:border-red-400"
                />
              </div>

              <div>
                <Label htmlFor="withdrawal-description" className="text-red-100">Комментарий</Label>
                <Textarea
                  id="withdrawal-description"
                  placeholder="Дополнительная информация (необязательно)"
                  value={withdrawalDescription}
                  onChange={(e) => setWithdrawalDescription(e.target.value)}
                  rows={3}
                  className="mt-1 bg-background/50 backdrop-blur-sm border-red-500/30 focus:border-red-400"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  onClick={() => {
                    setWithdrawalAmount('');
                    setWithdrawalMethod('');
                    setWithdrawalDetails('');
                    setWithdrawalDescription('');
                  }}
                  variant="outline"
                  disabled={withdrawalLoading}
                  className="border-red-500/30 hover:bg-red-500/10"
                >
                  Очистить
                </Button>
                <Button 
                  onClick={handleWithdrawal}
                  disabled={withdrawalLoading || !withdrawalAmount || !withdrawalMethod || !withdrawalDetails}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg hover:shadow-red-500/50 transition-all duration-300"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  {withdrawalLoading ? "Создание заявки..." : "Создать заявку"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal History */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent backdrop-blur-xl border-2 border-amber-500/50 hover:border-amber-400 transition-all duration-500 hover:-translate-y-2 animate-fade-in animation-delay-100">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-amber-400/40 transition-all duration-500"></div>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-100"></div>
            </div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center space-x-2 text-amber-100 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                <div className="p-2 bg-amber-500/30 rounded-xl backdrop-blur-sm">
                  <Calendar className="h-5 w-5 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                </div>
                <span>История выводов</span>
              </CardTitle>
              <CardDescription className="text-amber-50/80">
                Последние заявки на вывод средств
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 relative">
              <WithdrawalHistory />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
