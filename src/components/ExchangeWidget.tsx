import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useExchange, ExchangeTransaction } from '@/hooks/useExchange';
import { useCurrency } from '@/hooks/useCurrency';
import { ArrowRightLeft, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface ExchangeWidgetProps {
  userId: string;
  barrelBalance: number;
  oilcoinBalance: number;
  rubleBalance: number;
  onExchangeComplete: () => void;
}

export const ExchangeWidget = ({
  userId,
  barrelBalance,
  oilcoinBalance,
  rubleBalance,
  onExchangeComplete
}: ExchangeWidgetProps) => {
  const { loading, getExchangeRate, exchangeCurrency, getExchangeHistory } = useExchange();
  const { formatBarrels, formatOilCoins, formatRubles } = useCurrency();

  const [barrelAmount, setBarrelAmount] = useState('');
  const [oilcoinToRubleAmount, setOilcoinToRubleAmount] = useState('');
  const [rubleToOilcoinAmount, setRubleToOilcoinAmount] = useState('');
  
  const [barrelRate, setBarrelRate] = useState<number>(0);
  const [oilcoinToRubleRate, setOilcoinToRubleRate] = useState<number>(0);
  const [rubleToOilcoinRate, setRubleToOilcoinRate] = useState<number>(0);
  
  const [history, setHistory] = useState<ExchangeTransaction[]>([]);

  useEffect(() => {
    loadRates();
    loadHistory();
  }, []);

  const loadRates = async () => {
    const barrelToOilcoin = await getExchangeRate('BARREL', 'OILCOIN');
    const oilcoinToRuble = await getExchangeRate('OILCOIN', 'RUBLE');
    const rubleToOilcoin = await getExchangeRate('RUBLE', 'OILCOIN');
    
    if (barrelToOilcoin) setBarrelRate(barrelToOilcoin);
    if (oilcoinToRuble) setOilcoinToRubleRate(oilcoinToRuble);
    if (rubleToOilcoin) setRubleToOilcoinRate(rubleToOilcoin);
  };

  const loadHistory = async () => {
    const data = await getExchangeHistory(userId);
    setHistory(data);
  };

  const handleBarrelExchange = async () => {
    const amount = parseFloat(barrelAmount);
    if (isNaN(amount) || amount < 1000) {
      toast.error('Минимальная сумма обмена: 1000 баррелей');
      return;
    }
    if (amount > barrelBalance) {
      toast.error('Недостаточно баррелей');
      return;
    }

    const success = await exchangeCurrency(userId, 'BARREL', 'OILCOIN', amount);
    if (success) {
      setBarrelAmount('');
      onExchangeComplete();
      loadHistory();
    }
  };

  const handleOilcoinToRubleExchange = async () => {
    const amount = parseFloat(oilcoinToRubleAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Введите корректную сумму');
      return;
    }
    if (amount > oilcoinBalance) {
      toast.error('Недостаточно ОилКоинов');
      return;
    }

    const success = await exchangeCurrency(userId, 'OILCOIN', 'RUBLE', amount);
    if (success) {
      setOilcoinToRubleAmount('');
      onExchangeComplete();
      loadHistory();
    }
  };

  const handleRubleToOilcoinExchange = async () => {
    const amount = parseFloat(rubleToOilcoinAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Введите корректную сумму');
      return;
    }
    if (amount > rubleBalance) {
      toast.error('Недостаточно рублей');
      return;
    }

    const success = await exchangeCurrency(userId, 'RUBLE', 'OILCOIN', amount);
    if (success) {
      setRubleToOilcoinAmount('');
      onExchangeComplete();
      loadHistory();
    }
  };

  const calculateBarrelOutput = () => {
    const amount = parseFloat(barrelAmount);
    return isNaN(amount) ? 0 : Math.floor(amount * barrelRate);
  };

  const calculateOilcoinToRubleOutput = () => {
    const amount = parseFloat(oilcoinToRubleAmount);
    return isNaN(amount) ? 0 : Math.floor(amount * oilcoinToRubleRate);
  };

  const calculateRubleToOilcoinOutput = () => {
    const amount = parseFloat(rubleToOilcoinAmount);
    return isNaN(amount) ? 0 : Math.floor(amount * rubleToOilcoinRate);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Биржа</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Баррели</p>
            <p className="text-xl font-bold">{formatBarrels(barrelBalance)}</p>
          </div>
          <div className="bg-card/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">ОилКоины</p>
            <p className="text-xl font-bold">{formatOilCoins(oilcoinBalance)}</p>
          </div>
          <div className="bg-card/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Рубли</p>
            <p className="text-xl font-bold">{formatRubles(rubleBalance)}</p>
          </div>
        </div>

        <Tabs defaultValue="barrel" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="barrel">Баррели → ОилКоины</TabsTrigger>
            <TabsTrigger value="oilcoin">ОилКоины ⇄ Рубли</TabsTrigger>
          </TabsList>

          <TabsContent value="barrel" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Количество баррелей (мин. 1000)</Label>
              <Input
                type="number"
                placeholder="Введите количество баррелей"
                value={barrelAmount}
                onChange={(e) => setBarrelAmount(e.target.value)}
                min="1000"
                step="1000"
              />
              <p className="text-sm text-muted-foreground">
                Курс: 1000 🛢️ = 1 💰 | Вы получите: {calculateBarrelOutput()} 💰
              </p>
            </div>
            <Button 
              onClick={handleBarrelExchange} 
              disabled={loading}
              className="w-full"
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Обменять баррели на ОилКоины
            </Button>
          </TabsContent>

          <TabsContent value="oilcoin" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ОилКоины → Рубли</Label>
                <Input
                  type="number"
                  placeholder="Введите количество ОилКоинов"
                  value={oilcoinToRubleAmount}
                  onChange={(e) => setOilcoinToRubleAmount(e.target.value)}
                  min="1"
                />
                <p className="text-sm text-muted-foreground">
                  Курс: 1 💰 = 1 ₽ | Вы получите: {calculateOilcoinToRubleOutput()} ₽
                </p>
                <Button 
                  onClick={handleOilcoinToRubleExchange} 
                  disabled={loading}
                  className="w-full"
                >
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Обменять ОилКоины на Рубли
                </Button>
              </div>

              <div className="border-t pt-4 space-y-2">
                <Label>Рубли → ОилКоины</Label>
                <Input
                  type="number"
                  placeholder="Введите количество рублей"
                  value={rubleToOilcoinAmount}
                  onChange={(e) => setRubleToOilcoinAmount(e.target.value)}
                  min="1"
                />
                <p className="text-sm text-muted-foreground">
                  Курс: 1 ₽ = 1 💰 | Вы получите: {calculateRubleToOilcoinOutput()} 💰
                </p>
                <Button 
                  onClick={handleRubleToOilcoinExchange} 
                  disabled={loading}
                  className="w-full"
                  variant="secondary"
                >
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Обменять Рубли на ОилКоины
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {history.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">История обменов</h3>
          <div className="space-y-2">
            {history.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {transaction.from_currency} → {transaction.to_currency}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleString('ru-RU')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    -{Math.floor(transaction.from_amount)} → +{Math.floor(transaction.to_amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Курс: {transaction.exchange_rate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
