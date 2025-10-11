import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Star, Zap, ArrowLeft, Camera, Send, ArrowRight, Gift } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import CryptoJS from "crypto-js";
import { RobokassaWidget } from '../RobokassaWidget';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopUp?: (amount?: number, packageData?: any, paymentMethod?: string) => void;
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
  firstTimeOnly?: boolean;
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
    firstTimeOnly: true
  },
  {
    id: 'premium_plus',
    name: 'Премиум+',
    rubAmount: 5000,
    baseOC: 5000,
    bonusOC: 1000,
    totalOC: 6000,
    badge: '+20%',
    popular: false
  },
  {
    id: 'elite_6k',
    name: 'Элитный 6К',
    rubAmount: 6000,
    baseOC: 6000,
    bonusOC: 1260,
    totalOC: 7260,
    badge: '+21%',
    popular: false
  },
  {
    id: 'elite_7k',
    name: 'Элитный 7К',
    rubAmount: 7000,
    baseOC: 7000,
    bonusOC: 1540,
    totalOC: 8540,
    badge: '+22%',
    popular: false
  },
  {
    id: 'elite_8k',
    name: 'Элитный 8К',
    rubAmount: 8000,
    baseOC: 8000,
    bonusOC: 1840,
    totalOC: 9840,
    badge: '+23%',
    popular: false
  },
  {
    id: 'advanced',
    name: 'Продвинутый',
    rubAmount: 4000,
    baseOC: 4000,
    bonusOC: 600,
    totalOC: 4600,
    badge: '+15%',
    popular: false
  },
  {
    id: 'standard_3k',
    name: 'Стандарт+',
    rubAmount: 3000,
    baseOC: 3000,
    bonusOC: 300,
    totalOC: 3300,
    badge: '+10%',
    popular: false
  },
  {
    id: 'standard_2k',
    name: 'Стандарт',
    rubAmount: 2000,
    baseOC: 2000,
    bonusOC: 200,
    totalOC: 2200,
    badge: '+10%',
    popular: false
  },
  {
    id: 'basic',
    name: 'Базовый',
    rubAmount: 1000,
    baseOC: 1000,
    bonusOC: 0,
    totalOC: 1000,
    badge: null,
    popular: false
  }
];

export const TopUpModal = ({ isOpen, onClose, onTopUp, topUpLoading }: TopUpModalProps) => {
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<TopUpPackage | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'robokassa' | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const { currencyConfig, formatRealCurrency, formatGameCurrency } = useCurrency();
  const { user } = useAuth();
  const { toast } = useToast();

  // Очистка состояния при закрытии модала
  useEffect(() => {
    if (!isOpen) {
      console.log('Modal closed, resetting state');
      setCustomAmount("");
      setSelectedPackage(null);
      setShowPayment(false);
      setPaymentAmount(0);
      setPaymentMethod(null);
      setPromoCode("");
      setPromoApplied(false);
    }
  }, [isOpen]);

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

  const handleCustomTopUp = () => {
    const amount = parseFloat(customAmount);
    if (amount && amount >= 10) {
      setPaymentAmount(amount);
      setShowPayment(true);
    }
  };

  const handlePackageSelect = (pkg: TopUpPackage) => {
    setPaymentAmount(pkg.rubAmount);
    setSelectedPackage(pkg);
    setShowPayment(true);
  };

  const handleBackToPayment = () => {
    setShowPayment(false);
    setPaymentAmount(0);
    setSelectedPackage(null);
    setPaymentMethod(null);
  };

  const handleCloseModal = () => {
    setShowPayment(false);
    setPaymentAmount(0);
    setSelectedPackage(null);
    setCustomAmount("");
    setPaymentMethod(null);
    onClose();
  };

  if (showPayment) {
    // Если метод оплаты не выбран - показываем выбор
    if (!paymentMethod) {
      return (
        <Dialog open={isOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="w-[96vw] max-w-sm mx-2 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBackToPayment}
                  className="p-1 h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle className="text-lg">🔄 Выберите способ оплаты</DialogTitle>
              </div>
              <DialogDescription>
                Сумма к оплате: {formatRealCurrency(paymentAmount)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-3">
                <Button 
                  onClick={() => setPaymentMethod('robokassa')}
                  variant="default"
                  className="p-6 h-auto w-full"
                >
                  <div className="flex items-center gap-3 w-full">
                    <CreditCard className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-semibold">Robokassa</div>
                      <div className="text-sm opacity-90">Банковские карты, электронные кошельки</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    // Обработка оплаты через Robokassa
    const handlePayment = async () => {
      toast({
        title: "Переход к оплате",
        description: `Форма оплаты Robokassa загружена. После успешной оплаты ${paymentAmount}₽ вы получите ${formatGameCurrency(selectedPackage ? selectedPackage.totalOC : paymentAmount)}!`,
      });
    };

    // Показываем платежную форму для Robokassa
    if (paymentMethod === 'robokassa') {
      return (
        <Dialog open={isOpen} onOpenChange={handleCloseModal} key="payment">
          <DialogContent className="w-[96vw] max-w-sm mx-2 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setPaymentMethod(null)}
                  className="p-1 h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle className="text-lg">Оплата через Robokassa</DialogTitle>
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground text-center">
                Пополнение на {paymentAmount}₽ → {formatGameCurrency(selectedPackage ? selectedPackage.totalOC : paymentAmount)}
              </div>

              {/* Промокод */}
              {!promoApplied && (
                <Card>
                  <CardContent className="p-3">
                    <Label htmlFor="promo" className="text-sm">Есть промокод?</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="promo"
                        placeholder="Введите промокод"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="text-sm"
                      />
                      <Button 
                        onClick={handleApplyPromoCode}
                        disabled={!promoCode.trim()}
                        size="sm"
                        variant="secondary"
                      >
                        Применить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {promoApplied && (
                <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/20 rounded-md">
                  <Gift className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">Промокод успешно применен!</span>
                </div>
              )}
              
              <RobokassaWidget
                amount={paymentAmount}
                onSuccess={() => {
                  toast({
                    title: "Оплата создана",
                    description: "Переходим к оплате...",
                  });
                  handleCloseModal();
                }}
                onError={(error) => {
                  toast({
                    title: "Ошибка оплаты",
                    description: error,
                    variant: "destructive"
                  });
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      );
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="w-[96vw] max-w-sm mx-2 max-h-[90vh] overflow-y-auto p-3">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
            Пополнение баланса
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Выберите сумму для пополнения или готовые пакеты с бонусами
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Custom Amount Section */}
          <Card>
            <CardContent className="p-3">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="amount" className="text-sm">Произвольная сумма (мин. 10 {currencyConfig.real_currency_symbol})</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="10"
                      min="10"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="text-sm"
                    />
                    <Button 
                      onClick={handleCustomTopUp}
                      disabled={!customAmount || parseFloat(customAmount) < 10}
                      size="sm"
                    >
                      Пополнить
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currencyConfig.exchange_rate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Offer Section */}
          <div>
            <h3 className="text-sm font-bold mb-3 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent px-1">
              🔥 Особое предложение
            </h3>
            
            {topUpPackages.filter(pkg => pkg.firstTimeOnly).map((pkg) => (
              <Card 
                key={pkg.id} 
                className="relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/25 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-2 border-primary/30 hover:border-primary/50 overflow-hidden group animate-scale-in"
                onClick={() => handlePackageSelect(pkg)}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/20 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform"></div>
                
                {/* Special badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-accent to-primary text-white border-0 shadow-lg px-4 py-2 text-sm font-bold animate-pulse">
                    <Zap className="h-4 w-4 mr-1" />
                    {pkg.badge}
                  </Badge>
                </div>
                
                <CardContent className="p-4 sm:p-6 relative z-10">
                  <div className="text-center space-y-4 sm:space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg sm:text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent px-2">
                        🔥 <span className="hidden xs:inline">Специальное предложение!</span><span className="xs:hidden">x2 БОНУС!</span>
                      </h4>
                      <p className="text-muted-foreground text-xs sm:text-sm px-2">
                        <span className="hidden sm:inline">Удвойте свои инвестиции прямо сейчас!</span>
                        <span className="sm:hidden">Двойной бонус сегодня!</span>
                      </p>
                    </div>
                    
                    {/* Main offer display */}
                    <div className="bg-card/70 rounded-xl p-3 sm:p-6 border border-primary/20">
                      <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-3 sm:mb-4">
                        <div className="text-center space-y-1">
                          <div className="text-sm text-muted-foreground">Вы платите</div>
                          <div className="text-2xl font-bold text-primary">
                            {formatRealCurrency(pkg.rubAmount)}
                          </div>
                        </div>
                        
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                          <ArrowRight className="h-4 w-4 text-white" />
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
                        <div className="flex items-center justify-center space-x-2 text-xs font-medium text-primary">
                          <Star className="h-3 w-3" />
                          <span>Выгода 100% • Мгновенное зачисление</span>
                          <Star className="h-3 w-3" />
                        </div>
                      </div>
                    </div>

                    <Button 
                      size="lg"
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePackageSelect(pkg);
                      }}
                    >
                      <Gift className="h-5 w-5 mr-2" />
                      Получить удвоенный бонус
                      <Zap className="h-5 w-5 ml-2" />
                    </Button>
                    
                    <div className="text-xs text-muted-foreground flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Предложение действует ограниченное время</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Regular Packages Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Другие пакеты пополнения</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topUpPackages.filter(pkg => !pkg.firstTimeOnly).map((pkg) => (
                <Card 
                  key={pkg.id} 
                  className={`relative cursor-pointer transition-all duration-300 hover:shadow-luxury ${pkg.popular ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handlePackageSelect(pkg)}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="gradient-gold text-primary-foreground">
                        <Star className="h-3 w-3 mr-1" />
                        Популярный
                      </Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-4">
                    <div className="text-center space-y-3">
                      <h4 className="font-bold text-lg">{pkg.name}</h4>
                      
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-primary">
                          {formatGameCurrency(pkg.totalOC)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatRealCurrency(pkg.rubAmount)}
                        </div>
                      </div>

                      {pkg.bonusOC > 0 && (
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">
                            {formatGameCurrency(pkg.baseOC)} + {formatGameCurrency(pkg.bonusOC)} бонус
                          </div>
                          {pkg.badge && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {pkg.badge}
                            </Badge>
                          )}
                        </div>
                      )}

                      <Button 
                        className="w-full gradient-gold text-primary-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePackageSelect(pkg);
                        }}
                      >
                        Выбрать
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>После нажатия кнопки вы сможете выбрать способ оплаты:</p>
            <p>Robokassa (карты, кошельки) или QR-код через банковское приложение</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopUpModal;