import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Star, Zap, Building2 } from "lucide-react";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopUp: (amount?: number, packageData?: any, paymentMethod?: string) => void;
  topUpLoading: boolean;
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

export const TopUpModal = ({ isOpen, onClose, onTopUp, topUpLoading }: TopUpModalProps) => {
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<TopUpPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("yookassa");

  const handleCustomTopUp = () => {
    const amount = parseFloat(customAmount);
    if (amount && amount >= 100) {
      onTopUp(amount, undefined, paymentMethod);
      setCustomAmount("");
    }
  };

  const handlePackageSelect = (pkg: TopUpPackage) => {
    setSelectedPackage(pkg);
    onTopUp(undefined, pkg, paymentMethod);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          {/* Payment Method Selection */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Способ оплаты</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4">
                  <Label htmlFor="yookassa" className="flex items-center space-x-3 cursor-pointer border rounded-lg p-3 hover:bg-accent transition-colors">
                    <RadioGroupItem value="yookassa" id="yookassa" />
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-sm font-medium">YooKassa</span>
                    </div>
                  </Label>
                  <Label htmlFor="tbank" className="flex items-center space-x-3 cursor-pointer border rounded-lg p-3 hover:bg-accent transition-colors">
                    <RadioGroupItem value="tbank" id="tbank" />
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Т-Банк</span>
                    </div>
                  </Label>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

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
                      disabled={!customAmount || parseFloat(customAmount) < 100 || topUpLoading}
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
                        disabled={topUpLoading}
                      >
                        {topUpLoading ? 'Обработка...' : 'Выбрать'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>После нажатия кнопки вы будете перенаправлены на безопасную страницу оплаты</p>
            <p>Пополнение происходит мгновенно после успешной оплаты</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};