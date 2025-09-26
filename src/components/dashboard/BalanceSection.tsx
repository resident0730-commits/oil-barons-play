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
  onTopUp: (customAmount?: number, packageData?: any, paymentMethod?: string) => Promise<void>;
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
    name: '🚀 МЕГА БОНУС!',
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
  const { formatGameCurrency, formatRealCurrency } = useCurrency();
  const { toast } = useToast();
  
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<TopUpPackage | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'robokassa' | 'qr' | null>(null);
  
  // Withdrawal form states
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>('');
  const [withdrawalMethod, setWithdrawalMethod] = useState<string>('');
  const [withdrawalDetails, setWithdrawalDetails] = useState<string>('');
  const [withdrawalDescription, setWithdrawalDescription] = useState<string>('');
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);

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

  // Main balance section
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

      {/* Custom Amount Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Произвольная сумма</span>
          </CardTitle>
          <CardDescription>
            Введите желаемую сумму для пополнения (минимум 1000 ₽)
            <br />
            <span className="text-primary font-medium">💡 Совет: для получения бонусов воспользуйтесь готовыми пакетами ниже</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="custom-amount">Сумма в рублях</Label>
              <Input
                id="custom-amount"
                type="number"
                placeholder="Введите сумму..."
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min="1000"
                className="mt-1"
              />
              {customAmount && parseFloat(customAmount) >= 1000 && (
                <p className="text-sm text-muted-foreground mt-1">
                  1 ₽ = 1 ₽
                </p>
              )}
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleCustomTopUp}
                disabled={!customAmount || parseFloat(customAmount) < 1000 || topUpLoading}
                className="bg-gradient-to-r from-primary to-accent hover:shadow-lg"
              >
                Пополнить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Offer */}
      <div className="relative">
        {/* Subtle glow effect */}
        <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg opacity-50"></div>
        
        <Card className="relative overflow-hidden border-2 border-primary/40 bg-gradient-to-br from-card via-primary/5 to-accent/10 hover-scale">
          {/* Elegant corner badge - адаптивный */}
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-lg shadow-lg transform rotate-12 animate-fade-in">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
            <span className="hidden sm:inline">ПРЕМИУМ ПРЕДЛОЖЕНИЕ</span>
            <span className="sm:hidden">ПРЕМИУМ</span>
          </div>

          {/* Subtle decorative elements - адаптивные */}
          <div className="absolute top-3 left-3 sm:top-6 sm:left-6 w-12 h-12 sm:w-20 sm:h-20 bg-primary/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-16 sm:h-16 bg-accent/10 rounded-full blur-xl"></div>

          <CardHeader className="relative z-10 p-3 sm:p-6">
            <CardTitle className="flex items-center space-x-2 sm:space-x-3 text-xl sm:text-3xl font-bold">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
                <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Особое предложение
              </span>
            </CardTitle>
            <CardDescription className="text-sm sm:text-lg text-muted-foreground">
              🚀 Удвойте свой бонус с максимальной выгодой
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10 p-3 sm:p-6">
            <div 
              className="cursor-pointer group"
              onClick={() => handlePackageSelect(topUpPackages[8])}
            >
              <div className="bg-gradient-to-br from-card to-primary/10 p-4 sm:p-8 rounded-2xl border border-primary/30 group-hover:border-primary/50 group-hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                
                {/* Subtle hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="text-center space-y-4 sm:space-y-6 relative z-10">
                  {/* Stylish offer badge - адаптивный */}
                  <div className="inline-flex items-center bg-gradient-to-r from-primary to-accent text-white py-2 px-4 sm:py-3 sm:px-8 rounded-full font-bold text-sm sm:text-xl shadow-lg group-hover:shadow-primary/25 transition-shadow duration-300">
                    <Gift className="h-3 w-3 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">x2 УДВОЕНИЕ БОНУСА</span>
                    <span className="sm:hidden">x2 БОНУС</span>
                    <TrendingUp className="h-3 w-3 sm:h-5 sm:w-5 ml-1 sm:ml-2" />
                  </div>
                  
                   <p className="text-sm sm:text-xl font-semibold text-foreground px-2">
                     Пополните счет — получите в два раза больше
                   </p>
                  
                  {/* Elegant comparison - адаптивная сетка */}
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
                       <p className="text-lg sm:text-2xl font-bold text-primary">20 000 ₽</p>
                    </div>
                  </div>
                  
                  {/* Elegant benefits - адаптивная сетка */}
                  <div className="bg-gradient-to-r from-muted/50 to-primary/5 p-3 sm:p-6 rounded-xl border border-primary/20">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center justify-center sm:justify-start space-x-2 text-green-700">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="h-2 w-2 sm:h-3 sm:w-3 text-green-600" />
                        </div>
                        <span className="font-medium">Выгода 100%</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start space-x-2 text-blue-700">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-full flex items-center justify-center">
                          <Zap className="h-2 w-2 sm:h-3 sm:w-3 text-blue-600" />
                        </div>
                        <span className="font-medium">Мгновенно</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start space-x-2 text-purple-700">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-purple-100 rounded-full flex items-center justify-center">
                          <Star className="h-2 w-2 sm:h-3 sm:w-3 text-purple-600" />
                        </div>
                        <span className="font-medium">Без комиссий</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Modern CTA button - адаптивная */}
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
                  
                  {/* Stylish notice - адаптивный */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 p-3 sm:p-4 rounded-xl">
                    <div className="flex items-center justify-center space-x-2 text-amber-700">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="font-semibold text-xs sm:text-sm text-center">
                        <span className="hidden sm:inline">Эксклюзивное предложение • Ограниченное время</span>
                        <span className="sm:hidden">Ограниченное время</span>
                      </span>
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regular Packages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="h-5 w-5" />
            <span>Готовые пакеты</span>
          </CardTitle>
          <CardDescription>
            Выберите один из готовых пакетов для быстрого пополнения
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {topUpPackages.slice(0, -1).map((pkg) => (
              <div
                key={pkg.id}
                className={`
                  relative cursor-pointer group transition-all duration-300 hover:shadow-lg
                  p-4 rounded-lg border-2 hover:border-primary/50
                  ${pkg.popular ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'}
                `}
                onClick={() => handlePackageSelect(pkg)}
              >
                {pkg.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      Популярный
                    </Badge>
                  </div>
                )}

                <div className="text-center space-y-3">
                  <h3 className="font-semibold text-lg">{pkg.name}</h3>
                  
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-primary">
                      {formatRealCurrency(pkg.rubAmount)}
                    </p>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Базовая сумма:</span>
                        <span>{formatGameCurrency(pkg.ocAmount)}</span>
                      </div>
                      
                      {pkg.bonusOC > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Бонус:</span>
                          <span className="text-green-600 font-medium">
                            +{formatGameCurrency(pkg.bonusOC)}
                          </span>
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div className="flex justify-between font-medium">
                        <span>Итого:</span>
                        <span className="text-primary">{formatGameCurrency(pkg.totalOC)}</span>
                      </div>
                    </div>
                  </div>

                  {pkg.savings && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Экономия {pkg.savings}
                    </Badge>
                  )}

                  <Button 
                    className="w-full group-hover:shadow-md transition-shadow"
                    variant={pkg.popular ? "default" : "outline"}
                    disabled={topUpLoading}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Выбрать пакет
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5" />
            <span>Вывод средств</span>
          </CardTitle>
          <CardDescription>
            Создайте заявку на вывод средств. Доступно для вывода: {formatGameCurrency(profile?.balance || 0)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="withdrawal-amount">Сумма для вывода *</Label>
              <Input
                id="withdrawal-amount"
                type="number"
                placeholder="Введите сумму в рублях"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                min="1"
                max={profile?.balance || 0}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="withdrawal-method">Способ вывода *</Label>
              <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                <SelectTrigger className="mt-1">
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
            <Label htmlFor="withdrawal-details">Реквизиты *</Label>
            <Input
              id="withdrawal-details"
              placeholder="Номер карты, кошелька или адрес"
              value={withdrawalDetails}
              onChange={(e) => setWithdrawalDetails(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="withdrawal-description">Комментарий</Label>
            <Textarea
              id="withdrawal-description"
              placeholder="Дополнительная информация (необязательно)"
              value={withdrawalDescription}
              onChange={(e) => setWithdrawalDescription(e.target.value)}
              rows={3}
              className="mt-1"
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
            >
              Очистить
            </Button>
            <Button 
              onClick={handleWithdrawal}
              disabled={withdrawalLoading || !withdrawalAmount || !withdrawalMethod || !withdrawalDetails}
              className="bg-gradient-to-r from-primary to-accent hover:shadow-lg"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              {withdrawalLoading ? "Создание заявки..." : "Создать заявку"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>История операций</span>
          </CardTitle>
          <CardDescription>
            Последние операции по вашему счету
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="payments" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="payments">Пополнения</TabsTrigger>
              <TabsTrigger value="withdrawals">Выводы</TabsTrigger>
            </TabsList>
            <TabsContent value="payments" className="mt-4">
              <PaymentHistory />
            </TabsContent>
            <TabsContent value="withdrawals" className="mt-4">
              <WithdrawalHistory />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};