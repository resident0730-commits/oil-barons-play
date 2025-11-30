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
  const { formatBarrels, formatOilCoins, formatRubles, currencyConfig } = useCurrency();

  const [barrelAmount, setBarrelAmount] = useState('');
  const [oilcoinToRubleAmount, setOilcoinToRubleAmount] = useState('');
  
  const [barrelRate, setBarrelRate] = useState<number>(0);
  const [oilcoinToRubleRate, setOilcoinToRubleRate] = useState<number>(0);
  
  const [history, setHistory] = useState<ExchangeTransaction[]>([]);

  useEffect(() => {
    loadRates();
    loadHistory();
  }, []);

  const loadRates = async () => {
    const barrelToOilcoin = await getExchangeRate('BARREL', 'OILCOIN');
    const oilcoinToRuble = await getExchangeRate('OILCOIN', 'RUBLE');
    
    if (barrelToOilcoin) setBarrelRate(barrelToOilcoin);
    if (oilcoinToRuble) setOilcoinToRubleRate(oilcoinToRuble);
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

  const calculateBarrelOutput = () => {
    const amount = parseFloat(barrelAmount);
    return isNaN(amount) ? 0 : Math.floor(amount * barrelRate);
  };

  const calculateOilcoinToRubleOutput = () => {
    const amount = parseFloat(oilcoinToRubleAmount);
    return isNaN(amount) ? 0 : Math.floor(amount * oilcoinToRubleRate);
  };

  return (
    <div className="space-y-6">
      {/* Main Exchange Card */}
      <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent backdrop-blur-xl border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-purple-400/40 transition-all duration-500"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
        
        <CardContent className="relative p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
            <div className="p-2 sm:p-3 md:p-4 bg-purple-500/30 rounded-xl sm:rounded-2xl backdrop-blur-sm flex-shrink-0">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-100 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)] truncate">Биржа</h2>
          </div>
          
          {/* Balance Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <p className="text-sm sm:text-base text-purple-200/80 mb-1 sm:mb-2 font-medium truncate">{currencyConfig.barrel_symbol}</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-100 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] truncate">{formatBarrels(barrelBalance)}</p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <p className="text-sm sm:text-base text-purple-200/80 mb-1 sm:mb-2 font-medium truncate">{currencyConfig.oilcoin_symbol}</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-100 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] truncate">{formatOilCoins(oilcoinBalance)}</p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <p className="text-sm sm:text-base text-purple-200/80 mb-1 sm:mb-2 font-medium truncate">{currencyConfig.ruble_symbol}</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-100 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] truncate">{formatRubles(rubleBalance)}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="barrel" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-sm border border-purple-500/20 p-1 sm:p-1.5">
              <TabsTrigger value="barrel" className="text-xs sm:text-sm md:text-base data-[state=active]:bg-purple-500/30 data-[state=active]:text-purple-100 truncate">
                <span className="hidden sm:inline">{currencyConfig.barrel_symbol} → {currencyConfig.oilcoin_symbol}</span>
                <span className="sm:hidden">BBL → OC</span>
              </TabsTrigger>
              <TabsTrigger value="oilcoin" className="text-xs sm:text-sm md:text-base data-[state=active]:bg-purple-500/30 data-[state=active]:text-purple-100 truncate">
                <span className="hidden sm:inline">{currencyConfig.oilcoin_symbol} → {currencyConfig.ruble_symbol}</span>
                <span className="sm:hidden">OC → ₽</span>
              </TabsTrigger>
            </TabsList>

            {/* Barrel Exchange Tab */}
            <TabsContent value="barrel" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6 md:mt-8">
              <Card className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 backdrop-blur-sm border border-purple-500/20">
                <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                  <div className="space-y-3 sm:space-y-4">
                    <Label className="text-purple-100 font-medium text-sm sm:text-base md:text-lg">Количество {currencyConfig.barrel_symbol} (мин. 1000)</Label>
                    <Input
                      type="number"
                      placeholder={`Введите количество ${currencyConfig.barrel_symbol}`}
                      value={barrelAmount}
                      onChange={(e) => setBarrelAmount(e.target.value)}
                      min="1000"
                      step="1000"
                      className="bg-black/30 border-purple-500/30 text-foreground placeholder:text-muted-foreground focus:border-purple-400 text-base sm:text-lg h-10 sm:h-12"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <span className="text-sm sm:text-base text-purple-200/80">Курс обмена:</span>
                      <span className="text-sm sm:text-base font-bold text-purple-100">1000 {currencyConfig.barrel_symbol} = 1 {currencyConfig.oilcoin_symbol}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <span className="text-sm sm:text-base text-purple-200/80">Вы получите:</span>
                      <span className="text-lg sm:text-xl font-bold text-purple-100 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">{calculateBarrelOutput()} {currencyConfig.oilcoin_symbol}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleBarrelExchange} 
                    disabled={loading}
                    className="w-full h-10 sm:h-12 text-sm sm:text-base md:text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] transition-all duration-300"
                  >
                    <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="truncate">Обменять {currencyConfig.barrel_symbol} на {currencyConfig.oilcoin_symbol}</span>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* OilCoin Exchange Tab */}
            <TabsContent value="oilcoin" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6 md:mt-8">
              {/* OilCoin to Ruble */}
              <Card className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 backdrop-blur-sm border border-purple-500/20">
                <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="p-2 sm:p-3 bg-purple-500/20 rounded-lg flex-shrink-0">
                      <ArrowRightLeft className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-purple-100 truncate">{currencyConfig.oilcoin_symbol} → {currencyConfig.ruble_symbol}</h3>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <Label className="text-purple-100 font-medium text-sm sm:text-base md:text-lg">Количество {currencyConfig.oilcoin_symbol}</Label>
                    <Input
                      type="number"
                      placeholder={`Введите количество ${currencyConfig.oilcoin_symbol}`}
                      value={oilcoinToRubleAmount}
                      onChange={(e) => setOilcoinToRubleAmount(e.target.value)}
                      min="1"
                      className="bg-black/30 border-purple-500/30 text-foreground placeholder:text-muted-foreground focus:border-purple-400 text-base sm:text-lg h-10 sm:h-12"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <span className="text-sm sm:text-base text-purple-200/80">Курс обмена:</span>
                      <span className="text-sm sm:text-base font-bold text-purple-100">1 {currencyConfig.oilcoin_symbol} = 1 {currencyConfig.ruble_symbol}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <span className="text-sm sm:text-base text-purple-200/80">Вы получите:</span>
                      <span className="text-lg sm:text-xl font-bold text-purple-100 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">{calculateOilcoinToRubleOutput()} {currencyConfig.ruble_symbol}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleOilcoinToRubleExchange} 
                    disabled={loading}
                    className="w-full h-10 sm:h-12 text-sm sm:text-base md:text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] transition-all duration-300"
                  >
                    <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                    <span className="truncate">Обменять {currencyConfig.oilcoin_symbol} на {currencyConfig.ruble_symbol}</span>
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
          
          <CardContent className="relative p-4 sm:p-6 md:p-10">
            <h3 className="text-xl sm:text-2xl font-bold text-purple-100 mb-4 sm:mb-6 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)] truncate">
              История обменов
            </h3>
            <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
              {history.map((transaction) => (
                <Card key={transaction.id} className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-purple-100 text-sm sm:text-base truncate">
                            {transaction.from_amount.toLocaleString()} {transaction.from_currency}
                          </span>
                          <ArrowRightLeft className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                          <span className="font-bold text-purple-100 text-sm sm:text-base truncate">
                            {transaction.to_amount.toLocaleString()} {transaction.to_currency}
                          </span>
                        </div>
                        <p className="text-xs text-purple-200/70">
                          {new Date(transaction.created_at).toLocaleString('ru-RU')}
                        </p>
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-purple-300 bg-purple-500/20 px-2 sm:px-3 py-1 rounded-full border border-purple-500/30 self-start sm:self-auto whitespace-nowrap">
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