import { useState, useEffect } from 'react';

export interface CurrencyConfig {
  barrel_name: string;
  barrel_symbol: string;
  oilcoin_name: string;
  oilcoin_symbol: string;
  ruble_name: string;
  ruble_symbol: string;
}

const DEFAULT_CONFIG: CurrencyConfig = {
  barrel_name: 'Баррель',
  barrel_symbol: '🛢️',
  oilcoin_name: 'ОилКоин',
  oilcoin_symbol: '💰',
  ruble_name: 'Рубль',
  ruble_symbol: '₽'
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
  const formatBarrels = (amount: number): string => {
    return `${Math.floor(amount).toLocaleString()} ${currencyConfig.barrel_symbol}`;
  };

  const formatOilCoins = (amount: number): string => {
    return `${Math.floor(amount).toLocaleString()} ${currencyConfig.oilcoin_symbol}`;
  };

  const formatRubles = (amount: number): string => {
    return `${Math.floor(amount).toLocaleString()} ${currencyConfig.ruble_symbol}`;
  };

  const formatBarrelsWithName = (amount: number): string => {
    return `${Math.floor(amount).toLocaleString()} ${currencyConfig.barrel_name}`;
  };

  const formatOilCoinsWithName = (amount: number): string => {
    return `${Math.floor(amount).toLocaleString()} ${currencyConfig.oilcoin_name}`;
  };

  const formatRublesWithName = (amount: number): string => {
    return `${Math.floor(amount).toLocaleString()} ${currencyConfig.ruble_name}`;
  };

  return {
    currencyConfig,
    loading,
    updateCurrencyConfig,
    formatBarrels,
    formatOilCoins,
    formatRubles,
    formatBarrelsWithName,
    formatOilCoinsWithName,
    formatRublesWithName,
    refreshConfig: loadCurrencyConfig
  };
};