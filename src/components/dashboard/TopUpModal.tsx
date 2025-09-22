import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Star, Zap, ArrowLeft, Camera, Send, QrCode, ArrowRight, Gift } from "lucide-react";
import qrPaymentImage from "@/assets/qr-payment.png";
import { useCurrency } from "@/hooks/useCurrency";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import CryptoJS from "crypto-js";

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
    id: 'first_time',
    name: '🔥 Специальное предложение!',
    rubAmount: 10000,
    baseOC: 10000,
    bonusOC: 10000,
    totalOC: 20000,
    badge: 'x2 БОНУС',
    popular: false,
    firstTimeOnly: true
  },
  {
    id: 'premium',
    name: 'Премиум',
    rubAmount: 5000,
    baseOC: 5000,
    bonusOC: 2000,
    totalOC: 7000,
    badge: '+2000 OC',
    popular: true
  },
  {
    id: 'ultimate',
    name: 'Ультимум',
    rubAmount: 10000,
    baseOC: 10000,
    bonusOC: 5000,
    totalOC: 15000,
    badge: '+5000 OC',
    popular: false
  },
  {
    id: 'basic',
    name: 'Базовый',
    rubAmount: 1000,
    baseOC: 1000,
    bonusOC: 200,
    totalOC: 1200,
    badge: '+200 OC',
    popular: false
  },
  {
    id: 'starter',
    name: 'Стартовый',
    rubAmount: 500,
    baseOC: 500,
    bonusOC: 0,
    totalOC: 500,
    badge: null,
    popular: false
  }
];

export const TopUpModal = ({ isOpen, onClose, onTopUp, topUpLoading }: TopUpModalProps) => {
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<TopUpPackage | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'robokassa' | 'qr' | null>(null);
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
    }
  }, [isOpen]);

  const handleCustomTopUp = () => {
    const amount = parseFloat(customAmount);
    if (amount && amount >= 20) {
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
          <DialogContent className="max-w-md">
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
                <DialogTitle>🔄 Выберите способ оплаты</DialogTitle>
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
                  className="p-6 h-auto"
                >
                  <div className="flex items-center gap-3 w-full">
                    <CreditCard className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-semibold">Robokassa</div>
                      <div className="text-sm opacity-90">Банковские карты, электронные кошельки</div>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => setPaymentMethod('qr')}
                  variant="outline"
                  className="p-6 h-auto"
                >
                  <div className="flex items-center gap-3 w-full">
                    <QrCode className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-semibold">QR-код</div>
                      <div className="text-sm text-muted-foreground">Оплата через мобильное приложение банка</div>
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
      const handleSubmitRobokassa = async () => {
        try {
          console.log('🚀 Robokassa платеж (актуальные данные)');
          
          // ТЕСТ: Сначала попробуем прямое пополнение
          console.log('🧪 Вызываем тестовое пополнение для пользователя:', user?.id)
          const { data: { session } } = await supabase.auth.getSession()
          const testResponse = await supabase.functions.invoke('test-deposit', {
            body: {
              userId: user?.id,
              rubAmount: paymentAmount,
              ocAmount: selectedPackage ? selectedPackage.totalOC : paymentAmount
            },
            headers: {
              Authorization: `Bearer ${session?.access_token}`
            }
          })
          
          console.log('TEST DEPOSIT RESULT:', testResponse)
          
          if (testResponse.data?.success) {
            toast({
              title: "ТЕСТ УСПЕШЕН!",
              description: `Баланс обновлен: ${testResponse.data.oldBalance} → ${testResponse.data.newBalance} OC`,
            });
            handleCloseModal();
            return;
          }
          
          // Актуальные данные Robokassa
          const merchantLogin = 'Oiltycoon';
          const password1 = 'uGgPuH5o11c2F8njdBpj';
          
          // Генерируем правильный InvoiceID: уникальное число в допустимом диапазоне 1-9223372036854775807
          const invoiceId = (Math.floor(Math.random() * 1000000) + Date.now() % 1000000).toString();
          const description = `Пополнение Oil Tycoon ${paymentAmount}₽`;
          
          // Создаем MD5 подпись по формуле: MerchantLogin:OutSum:InvoiceID:Password#1:Shp_Amount=paymentAmount:Shp_Currency=ocAmount:Shp_UserId=userId
          const ocAmount = selectedPackage ? selectedPackage.totalOC : paymentAmount;
          const signatureString = `${merchantLogin}:${paymentAmount}:${invoiceId}:${password1}:Shp_Amount=${paymentAmount}:Shp_Currency=${ocAmount}:Shp_UserId=${user?.id || ''}`;
          const signature = CryptoJS.MD5(signatureString).toString().toUpperCase();
          
          toast({
            title: "Переход к оплате",
            description: `Перенаправляем на Robokassa для оплаты ${paymentAmount}₽`,
            duration: 2000,
          });
          
          // Задержка перед перенаправлением
          setTimeout(() => {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://auth.robokassa.ru/Merchant/Index.aspx';
            form.target = '_blank';
            form.style.display = 'none';

            // Параметры с правильной подписью 
            const params = {
              MerchantLogin: merchantLogin,
              OutSum: paymentAmount.toString(),
              InvoiceID: invoiceId,
              Description: description,
              SignatureValue: signature,
              Culture: 'ru',
              SuccessURL: `${window.location.origin}/?payment=success&amount=${paymentAmount}&invoice=${invoiceId}`,
              FailURL: `${window.location.origin}/?payment=fail`,
              ResultURL: 'https://efaohdwvitrxanzzlgew.supabase.co/functions/v1/robokassa-result',
              Shp_UserId: user?.id || '',
              Shp_Amount: paymentAmount.toString(),
              Shp_Currency: (selectedPackage ? selectedPackage.totalOC : paymentAmount).toString()
            };

            // Добавляем параметры как скрытые поля
            Object.entries(params).forEach(([key, value]) => {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = value;
              form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }, 1500);
          
        } catch (error) {
          console.error('❌ Robokassa error:', error);
          toast({
            title: "Ошибка",
            description: "Не удалось создать платеж. Попробуйте позже.",
            variant: "destructive",
          });
        }
      };

      return (
        <Dialog open={isOpen} onOpenChange={handleCloseModal} key="payment">
          <DialogContent className="max-w-lg">
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
                <DialogTitle>Оплата через Robokassa</DialogTitle>
              </div>
              <DialogDescription>
                Сумма к оплате: {formatRealCurrency(paymentAmount)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">Robokassa</h3>
                    <p className="text-sm text-muted-foreground">Банковские карты, электронные кошельки</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      Сумма к оплате: <span className="font-semibold">{formatRealCurrency(paymentAmount)}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      После оплаты вы получите {selectedPackage ? formatGameCurrency(selectedPackage.totalOC) : formatGameCurrency(paymentAmount)} на баланс
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleSubmitRobokassa}
                    className="w-full"
                    size="lg"
                    disabled={topUpLoading}
                  >
                    {topUpLoading ? 'Обработка...' : 'Перейти к оплате через Robokassa'}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Вы будете перенаправлены на безопасную страницу оплаты Robokassa
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    // Показываем QR-код
    if (paymentMethod === 'qr') {
      return (
        <Dialog open={isOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-md">
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
                <DialogTitle>Оплата {formatRealCurrency(paymentAmount)}</DialogTitle>
              </div>
              <DialogDescription>
                Отсканируйте QR-код для оплаты
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg shadow-lg border">
                  <img 
                    src={qrPaymentImage} 
                    alt="QR-код для оплаты" 
                    className="w-64 h-64 object-contain"
                  />
                </div>
              </div>

              {/* Instructions */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Инструкция по оплате:
                  </h4>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="font-semibold">1.</span>
                      <span>Сделайте скриншот QR-кода или сохраните изображение</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">2.</span>
                      <span>Откройте приложение вашего банка</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">3.</span>
                      <span>Найдите функцию "Оплата по QR-коду"</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">4.</span>
                      <span>Отсканируйте код или загрузите изображение</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">5.</span>
                      <span>Введите сумму: <strong>{paymentAmount} ₽</strong></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">6.</span>
                      <span>Подтвердите платеж</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              {/* Final Step */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Send className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-primary mb-1">
                        Завершающий шаг:
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        После оплаты отправьте скриншот чека в поддержку для зачисления средств на баланс.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setPaymentMethod(null)}
                  className="flex-1"
                >
                  Назад
                </Button>
                <Button 
                  onClick={handleCloseModal}
                  className="flex-1"
                >
                  Закрыть
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      );
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Пополнение баланса
          </DialogTitle>
          <DialogDescription>
            Выберите сумму для пополнения или воспользуйтесь готовыми пакетами с бонусами
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Custom Amount Section */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Произвольная сумма (мин. 20 {currencyConfig.real_currency_symbol})</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="20"
                      min="20"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                    />
                    <Button 
                      onClick={handleCustomTopUp}
                      disabled={!customAmount || parseFloat(customAmount) < 20}
                    >
                      Пополнить
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currencyConfig.exchange_rate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Offer Section */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              🔥 Ограниченное предложение
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
                
                <CardContent className="p-8 relative z-10">
                  <div className="text-center space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {pkg.name}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Удвойте свои инвестиции прямо сейчас!
                      </p>
                    </div>
                    
                    {/* Main offer display */}
                    <div className="bg-card/70 rounded-xl p-6 border border-primary/20">
                      <div className="flex items-center justify-center space-x-4 mb-4">
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