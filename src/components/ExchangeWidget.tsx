import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
      {/* Main Exchange Card */}
      <Card className="group relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent backdrop-blur-xl border-2 border-amber-500/50 hover:border-amber-400 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-amber-400/40 transition-all duration-500"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
        
        <CardContent className="relative p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-500/30 rounded-2xl backdrop-blur-sm">
              <TrendingUp className="w-8 h-8 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
            </div>
            <h2 className="text-3xl font-bold text-amber-100 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Биржа</h2>
          </div>
          
          {/* Balance Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 to-orange-500/5 backdrop-blur-sm border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4">
                <p className="text-sm text-amber-200/80 mb-1 font-medium">Баррели</p>
                <p className="text-2xl font-bold text-amber-100 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">{formatBarrels(barrelBalance)}</p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/5 backdrop-blur-sm border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4">
                <p className="text-sm text-green-200/80 mb-1 font-medium">ОилКоины</p>
                <p className="text-2xl font-bold text-green-100 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">{formatOilCoins(oilcoinBalance)}</p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/5 backdrop-blur-sm border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4">
                <p className="text-sm text-blue-200/80 mb-1 font-medium">Рубли</p>
                <p className="text-2xl font-bold text-blue-100 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">{formatRubles(rubleBalance)}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="barrel" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-sm border border-amber-500/20">
              <TabsTrigger value="barrel" className="data-[state=active]:bg-amber-500/30 data-[state=active]:text-amber-100">
                Баррели → ОилКоины
              </TabsTrigger>
              <TabsTrigger value="oilcoin" className="data-[state=active]:bg-amber-500/30 data-[state=active]:text-amber-100">
                ОилКоины ⇄ Рубли
              </TabsTrigger>
            </TabsList>

            {/* Barrel Exchange Tab */}
            <TabsContent value="barrel" className="space-y-4 mt-6">
              <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 backdrop-blur-sm border border-amber-500/20">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-amber-100 font-medium">Количество баррелей (мин. 1000)</Label>
                    <Input
                      type="number"
                      placeholder="Введите количество баррелей"
                      value={barrelAmount}
                      onChange={(e) => setBarrelAmount(e.target.value)}
                      min="1000"
                      step="1000"
                      className="bg-black/30 border-amber-500/30 text-foreground placeholder:text-muted-foreground focus:border-amber-400"
                    />
                    <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <span className="text-sm text-amber-200/80">Курс обмена:</span>
                      <span className="text-sm font-bold text-amber-100">1000 🛢️ = 1 💰</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <span className="text-sm text-green-200/80">Вы получите:</span>
                      <span className="text-lg font-bold text-green-100 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">{calculateBarrelOutput()} 💰</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleBarrelExchange} 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.7)] transition-all duration-300"
                  >
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Обменять баррели на ОилКоины
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* OilCoin Exchange Tab */}
            <TabsContent value="oilcoin" className="space-y-4 mt-6">
              {/* OilCoin to Ruble */}
              <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 backdrop-blur-sm border border-green-500/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <ArrowRightLeft className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold text-green-100">ОилКоины → Рубли</h3>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-green-100 font-medium">Количество ОилКоинов</Label>
                    <Input
                      type="number"
                      placeholder="Введите количество ОилКоинов"
                      value={oilcoinToRubleAmount}
                      onChange={(e) => setOilcoinToRubleAmount(e.target.value)}
                      min="1"
                      className="bg-black/30 border-green-500/30 text-foreground placeholder:text-muted-foreground focus:border-green-400"
                    />
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <span className="text-sm text-green-200/80">Курс обмена:</span>
                      <span className="text-sm font-bold text-green-100">1 💰 = 1 ₽</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <span className="text-sm text-blue-200/80">Вы получите:</span>
                      <span className="text-lg font-bold text-blue-100 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">{calculateOilcoinToRubleOutput()} ₽</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleOilcoinToRubleExchange} 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] transition-all duration-300"
                  >
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Обменять ОилКоины на Рубли
                  </Button>
                </CardContent>
              </Card>

              {/* Ruble to OilCoin */}
              <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 backdrop-blur-sm border border-blue-500/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <ArrowRightLeft className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-blue-100">Рубли → ОилКоины</h3>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-100 font-medium">Количество рублей</Label>
                    <Input
                      type="number"
                      placeholder="Введите количество рублей"
                      value={rubleToOilcoinAmount}
                      onChange={(e) => setRubleToOilcoinAmount(e.target.value)}
                      min="1"
                      className="bg-black/30 border-blue-500/30 text-foreground placeholder:text-muted-foreground focus:border-blue-400"
                    />
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <span className="text-sm text-blue-200/80">Курс обмена:</span>
                      <span className="text-sm font-bold text-blue-100">1 ₽ = 1 💰</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <span className="text-sm text-green-200/80">Вы получите:</span>
                      <span className="text-lg font-bold text-green-100 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">{calculateRubleToOilcoinOutput()} 💰</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleRubleToOilcoinExchange} 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] transition-all duration-300"
                  >
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Обменять Рубли на ОилКоины
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Exchange History Card */}
      {history.length > 0 && (
        <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent backdrop-blur-xl border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-purple-400/40 transition-all duration-500"></div>
          
          <CardContent className="relative p-6 sm:p-10">
            <h3 className="text-2xl font-bold text-purple-100 mb-6 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              История обменов
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {history.map((transaction) => (
                <Card key={transaction.id} className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-purple-100">
                            {transaction.from_amount.toLocaleString()} {transaction.from_currency}
                          </span>
                          <ArrowRightLeft className="w-4 h-4 text-purple-400" />
                          <span className="font-bold text-purple-100">
                            {transaction.to_amount.toLocaleString()} {transaction.to_currency}
                          </span>
                        </div>
                        <p className="text-xs text-purple-200/70">
                          {new Date(transaction.created_at).toLocaleString('ru-RU')}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                        x{transaction.exchange_rate}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};