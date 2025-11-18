import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ExchangeRate {
  from_currency: string;
  to_currency: string;
  rate: number;
}

export interface ExchangeTransaction {
  id: string;
  from_currency: string;
  to_currency: string;
  from_amount: number;
  to_amount: number;
  exchange_rate: number;
  created_at: string;
}

export const useExchange = () => {
  const [loading, setLoading] = useState(false);

  const getExchangeRate = async (fromCurrency: string, toCurrency: string): Promise<number | null> => {
    try {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('rate')
        .eq('from_currency', fromCurrency)
        .eq('to_currency', toCurrency)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data.rate;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      return null;
    }
  };

  const exchangeCurrency = async (
    userId: string,
    fromCurrency: string,
    toCurrency: string,
    fromAmount: number
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('exchange_currency', {
        p_user_id: userId,
        p_from_currency: fromCurrency,
        p_to_currency: toCurrency,
        p_from_amount: fromAmount
      });

      if (error) throw error;

      const result = data as any;
      if (result.success) {
        toast.success(`Обмен выполнен! Получено ${Math.floor(result.to_amount)} ${toCurrency}`);
        return true;
      } else {
        toast.error(result.error || 'Ошибка обмена');
        return false;
      }
    } catch (error: any) {
      console.error('Error exchanging currency:', error);
      toast.error(error.message || 'Ошибка при обмене валюты');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getExchangeHistory = async (userId: string): Promise<ExchangeTransaction[]> => {
    try {
      const { data, error } = await supabase
        .from('exchange_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching exchange history:', error);
      return [];
    }
  };

  return {
    loading,
    getExchangeRate,
    exchangeCurrency,
    getExchangeHistory
  };
};
