import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Star, Zap, ArrowLeft, Camera, Send } from "lucide-react";
import qrPaymentImage from "@/assets/qr-payment.png";

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
    id: 'starter',
    name: 'Стартовый',
    rubAmount: 500,
    baseOC: 500,
    bonusOC: 0,
    totalOC: 500,
    badge: null,
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
    id: 'first_time',
    name: 'Первое пополнение',
    rubAmount: 10000,
    baseOC: 10000,
    bonusOC: 10000,
    totalOC: 20000,
    badge: 'x2 БОНУС',
    popular: false,
    firstTimeOnly: true
  }
];

export const TopUpModal = ({ isOpen, onClose }: TopUpModalProps) => {
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<TopUpPackage | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const handleCustomTopUp = () => {
    const amount = parseFloat(customAmount);
    if (amount && amount >= 100) {
      setPaymentAmount(amount);
      setShowQR(true);
    }
  };

  const handlePackageSelect = (pkg: TopUpPackage) => {
    setPaymentAmount(pkg.rubAmount);
    setSelectedPackage(pkg);
    setShowQR(true);
  };

  const handleBackToPayment = () => {
    setShowQR(false);
    setPaymentAmount(0);
    setSelectedPackage(null);
  };

  const handleCloseModal = () => {
    setShowQR(false);
    setPaymentAmount(0);
    setSelectedPackage(null);
    setCustomAmount("");
    onClose();
  };

  if (showQR) {
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
              <DialogTitle>Оплата {paymentAmount} ₽</DialogTitle>
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
                onClick={handleBackToPayment}
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
                  <Label htmlFor="amount">Произвольная сумма (мин. 100 ₽)</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="100"
                      min="100"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                    />
                    <Button 
                      onClick={handleCustomTopUp}
                      disabled={!customAmount || parseFloat(customAmount) < 100}
                    >
                      Пополнить
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    1 ₽ = 1 OC
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Пакеты с бонусами</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topUpPackages.map((pkg) => (
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
                          {pkg.totalOC.toLocaleString()} OC
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {pkg.rubAmount.toLocaleString()} ₽
                        </div>
                      </div>

                      {pkg.bonusOC > 0 && (
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">
                            {pkg.baseOC.toLocaleString()} + {pkg.bonusOC.toLocaleString()} бонус
                          </div>
                          {pkg.badge && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {pkg.badge}
                            </Badge>
                          )}
                        </div>
                      )}

                      {pkg.firstTimeOnly && (
                        <Badge className="bg-red-100 text-red-800 border-red-300">
                          <Zap className="h-3 w-3 mr-1" />
                          Только первая покупка
                        </Badge>
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
            <p>После нажатия кнопки появится QR-код для оплаты</p>
            <p>Следуйте инструкциям для завершения платежа</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};