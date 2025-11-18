import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrency } from '@/hooks/useCurrency';
import { Coins, DollarSign, ArrowRightLeft } from 'lucide-react';

export function CurrencyManager() {
  const { currencyConfig } = useCurrency();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Валюты игры
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Coins className="h-4 w-4" />
              {currencyConfig.barrel_name} {currencyConfig.barrel_symbol}
            </h4>
            <p className="text-sm text-muted-foreground">
              Добываются скважинами. Обмениваются на ОилКоины на бирже по курсу 1000:1.
            </p>
          </div>

          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
              <Coins className="h-4 w-4" />
              {currencyConfig.oilcoin_name} {currencyConfig.oilcoin_symbol}
            </h4>
            <p className="text-sm text-muted-foreground">
              Основная игровая валюта. Используется для покупки скважин, бустеров и улучшений.
            </p>
          </div>

          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-accent">
              <DollarSign className="h-4 w-4" />
              {currencyConfig.ruble_name} {currencyConfig.ruble_symbol}
            </h4>
            <p className="text-sm text-muted-foreground">
              Фиатная валюта для вывода средств. Обменивается с ОилКоинами 1:1 на бирже.
            </p>
          </div>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            Курсы обмена
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>Баррели → ОилКоины:</span>
              <span className="font-mono">1000 🛢️ = 1 💰</span>
            </div>
            <div className="flex justify-between items-center">
              <span>ОилКоины ⇄ Рубли:</span>
              <span className="font-mono">1 💰 = 1 ₽</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded">
          <p>
            <strong>Примечание:</strong> Система использует три валюты для игровой экономики. 
            Скважины добывают баррели, которые обмениваются на ОилКоины для покупок в игре. 
            ОилКоины можно обменять на рубли для вывода реальных денег.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
