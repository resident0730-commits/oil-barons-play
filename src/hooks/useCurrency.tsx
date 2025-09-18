import { useState, useEffect } from 'react';

export interface CurrencyConfig {
  game_currency_name: string;
  game_currency_symbol: string;
  real_currency_name: string;
  real_currency_symbol: string;
  exchange_rate: string;
}

const DEFAULT_CONFIG: CurrencyConfig = {
  game_currency_name: 'Рубль',
  game_currency_symbol: '₽',
  real_currency_name: 'российский рубль',
  real_currency_symbol: '₽',
  exchange_rate: '1 ₽ = 1 ₽'
};

export const useCurrency = () => {
  const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrencyConfig();
  }, []);

  const loadCurrencyConfig = () => {
    try {
      setLoading(true);
      
      const saved = localStorage.getItem('currency_config');
      if (saved) {
        const config = JSON.parse(saved);
        setCurrencyConfig({ ...DEFAULT_CONFIG, ...config });
      } else {
        setCurrencyConfig(DEFAULT_CONFIG);
      }
    } catch (error) {
      console.error('Error loading currency config:', error);
      setCurrencyConfig(DEFAULT_CONFIG);
    } finally {
      setLoading(false);
    }
  };

  const updateCurrencyConfig = (newConfig: Partial<CurrencyConfig>) => {
    const updatedConfig = { ...currencyConfig, ...newConfig };
    setCurrencyConfig(updatedConfig);
    localStorage.setItem('currency_config', JSON.stringify(updatedConfig));
  };

  // Утилиты для форматирования валют
  const formatGameCurrency = (amount: number): string => {
    return `${amount.toLocaleString()} ${currencyConfig.game_currency_symbol}`;
  };

  const formatRealCurrency = (amount: number): string => {
    return `${amount.toLocaleString()} ${currencyConfig.real_currency_symbol}`;
  };

  const formatGameCurrencyWithName = (amount: number): string => {
    return `${amount.toLocaleString()} ${currencyConfig.game_currency_name}`;
  };

  const getGameCurrencyDescription = (): string => {
    return `Используется только внутри игры для покупки скважин и улучшений`;
  };

  const getExchangeDescription = (): string => {
    return `${currencyConfig.exchange_rate}, фиксированный курс обмена`;
  };

  const getRealCurrencyName = (): string => {
    return currencyConfig.real_currency_name;
  };

  return {
    currencyConfig,
    loading,
    updateCurrencyConfig,
    formatGameCurrency,
    formatRealCurrency,
    formatGameCurrencyWithName,
    getGameCurrencyDescription,
    getExchangeDescription,
    getRealCurrencyName,
    refreshConfig: loadCurrencyConfig
  };
};