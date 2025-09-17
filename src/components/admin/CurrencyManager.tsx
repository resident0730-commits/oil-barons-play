import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/hooks/useCurrency';
import { Coins, DollarSign } from 'lucide-react';

export function CurrencyManager() {
  const { toast } = useToast();
  const { currencyConfig, updateCurrencyConfig } = useCurrency();

  const currencyOptions = [
    {
      name: 'OilCoin (Игровая валюта)',
      key: 'oilcoin',
      config: {
        game_currency_name: 'OilCoin',
        game_currency_symbol: 'OC',
        real_currency_name: 'российский рубль',
        real_currency_symbol: '₽',
        exchange_rate: '1 OC = 1 ₽'
      }
    },
    {
      name: 'Российский рубль',
      key: 'ruble',
      config: {
        game_currency_name: 'Рубль',
        game_currency_symbol: '₽',
        real_currency_name: 'российский рубль',
        real_currency_symbol: '₽',
        exchange_rate: '1 ₽ = 1 ₽'
      }
    }
  ];

  const currentCurrencyKey = currencyConfig.game_currency_symbol === 'OC' ? 'oilcoin' : 'ruble';

  const switchCurrency = (option: typeof currencyOptions[0]) => {
    updateCurrencyConfig(option.config);
    
    toast({
      title: "Валюта изменена",
      description: `Переключено на ${option.name}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Управление валютой
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Текущая валюта */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Текущая валюта
          </h4>
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium text-primary">Отображение:</span>
              <div>{currencyConfig.game_currency_name} ({currencyConfig.game_currency_symbol})</div>
            </div>
            <div>
              <span className="font-medium">Курс:</span>
              <div>{currencyConfig.exchange_rate}</div>
            </div>
          </div>
        </div>

        {/* Переключение валюты */}
        <div>
          <h4 className="font-semibold mb-4">Выбор валюты</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Выберите валюту для отображения в разделах "баланс", "ежедневный доход", "средняя прибыль"
          </p>
          <div className="grid gap-3">
            {currencyOptions.map((option) => (
              <Button
                key={option.key}
                variant={currentCurrencyKey === option.key ? "default" : "outline"}
                onClick={() => switchCurrency(option)}
                className="justify-start h-auto p-4"
                disabled={currentCurrencyKey === option.key}
              >
                <div className="text-left">
                  <div className="font-medium">{option.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {option.config.exchange_rate}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded">
          <p>
            <strong>Примечание:</strong> Изменение валюты применится мгновенно на всех страницах. 
            Пользователи увидят обновления после обновления страницы.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}