import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Zap, Gift, Package } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

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
}

const topUpPackages: TopUpPackage[] = [
  {
    id: 'mega_bonus',
    name: '🚀 Мега',
    rubAmount: 10000,
    baseOC: 10000,
    bonusOC: 10000,
    totalOC: 20000,
    badge: '100%',
    popular: true
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
    id: 'standard',
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
  const { formatRubles, formatOilCoins } = useCurrency();

  const handlePackageSelect = (pkg: TopUpPackage) => {
    if (onTopUp) {
      onTopUp(undefined, {
        price: pkg.rubAmount,
        oilcoins: pkg.totalOC
      }, 'yookassa');
    }
  };

  const handleCustomTopUp = () => {
    const amount = parseInt(customAmount);
    if (amount >= 100 && onTopUp) {
      onTopUp(amount, undefined, 'yookassa');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Пополнение баланса
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="packages" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Пакеты
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Своя сумма
            </TabsTrigger>
          </TabsList>

          {/* Packages Tab */}
          <TabsContent value="packages" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topUpPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer ${
                    pkg.popular 
                      ? 'border-2 border-primary shadow-lg shadow-primary/20' 
                      : 'border border-border hover:border-primary/50'
                  }`}
                  onClick={() => handlePackageSelect(pkg)}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
                      <Zap className="h-3 w-3 inline mr-1" />
                      ХИТ
                    </div>
                  )}
                  
                  <CardContent className="p-4 space-y-3">
                    <div className="text-center">
                      <h3 className="text-lg font-bold mb-1">{pkg.name}</h3>
                      {pkg.badge && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <Gift className="h-3 w-3 mr-1" />
                          {pkg.badge}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Цена:</span>
                        <span className="font-bold text-lg">{formatRubles(pkg.rubAmount)}</span>
                      </div>
                      
                      <div className="bg-primary/10 rounded-lg p-3 space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Базовых:</span>
                          <span className="font-semibold">{formatOilCoins(pkg.baseOC)}</span>
                        </div>
                        {pkg.bonusOC > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-green-400">+ Бонус:</span>
                            <span className="font-semibold text-green-400">{formatOilCoins(pkg.bonusOC)}</span>
                          </div>
                        )}
                        <div className="h-px bg-border my-2" />
                        <div className="flex justify-between items-center">
                          <span className="font-bold">Всего:</span>
                          <span className="font-bold text-primary text-lg">{formatOilCoins(pkg.totalOC)}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg"
                      disabled={topUpLoading}
                    >
                      {topUpLoading ? 'Обработка...' : 'Выбрать'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Custom Amount Tab */}
          <TabsContent value="custom" className="space-y-6">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount" className="text-base font-semibold">
                      Введите сумму пополнения
                    </Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Минимум: 100₽ • Курс: 1₽ = 1 OilCoin
                    </p>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="1000"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="text-lg h-12"
                      min="100"
                    />
                  </div>

                  {customAmount && parseInt(customAmount) >= 100 && (
                    <div className="bg-primary/10 rounded-lg p-4 space-y-2 animate-fade-in">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">К оплате:</span>
                        <span className="text-2xl font-bold">{formatRubles(parseInt(customAmount))}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Вы получите:</span>
                        <span className="text-2xl font-bold text-primary">{formatOilCoins(parseInt(customAmount))}</span>
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleCustomTopUp}
                  disabled={!customAmount || parseInt(customAmount) < 100 || topUpLoading}
                  className="w-full h-12 text-lg bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg"
                  size="lg"
                >
                  {topUpLoading ? 'Обработка...' : 'Пополнить'}
                </Button>
              </CardContent>
            </Card>

            {/* Quick amount buttons */}
            <div className="grid grid-cols-3 gap-3">
              {[500, 1000, 2000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setCustomAmount(amount.toString())}
                  className="h-16 flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/10"
                >
                  <span className="text-xs text-muted-foreground">Быстро</span>
                  <span className="font-bold">{amount}₽</span>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground border-t pt-4">
          Безопасная оплата через проверенные платежные системы
        </div>
      </DialogContent>
    </Dialog>
  );
};
