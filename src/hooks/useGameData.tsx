import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { hasSupabase, supabase } from '@/lib/supabase';

export interface WellType {
  name: string;
  baseIncome: number;
  price: number;
  maxLevel: number;
  icon: string;
}

export interface UserWell {
  id: string;
  well_type: string;
  level: number;
  income_per_day: number;
  purchase_price: number;
}

export interface UserProfile {
  id: string;
  user_id: string;
  nickname: string;
  balance: number;
  total_daily_income: number;
}

export const wellTypes: WellType[] = [
  { name: "Стартовая скважина", baseIncome: 50, price: 500, maxLevel: 5, icon: "🔸" },
  { name: "Средняя скважина", baseIncome: 150, price: 1500, maxLevel: 10, icon: "⚡" },
  { name: "Промышленная скважина", baseIncome: 500, price: 5000, maxLevel: 15, icon: "🏭" },
  { name: "Супер скважина", baseIncome: 1500, price: 15000, maxLevel: 20, icon: "💎" }
];

export function useGameData() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wells, setWells] = useState<UserWell[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user data
  useEffect(() => {
    if (!hasSupabase || !user) {
      setLoading(false);
      return;
    }

    loadGameData();
  }, [user]);

  const loadGameData = async () => {
    if (!hasSupabase || !user) return;

    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Load wells
      const { data: wellsData } = await supabase
        .from('user_wells')
        .select('*')
        .eq('user_id', user.id);

      if (wellsData) {
        setWells(wellsData);
      }
    } catch (error) {
      console.error('Error loading game data:', error);
    } finally {
      setLoading(false);
    }
  };

  const buyWell = async (wellType: WellType) => {
    if (!hasSupabase || !user || !profile) return { success: false, error: 'Не авторизован' };

    if (profile.balance < wellType.price) {
      return { success: false, error: 'Недостаточно средств' };
    }

    try {
      // Insert new well
      const { data: newWell, error: wellError } = await supabase
        .from('user_wells')
        .insert({
          user_id: user.id,
          well_type: wellType.name,
          level: 1,
          income_per_day: wellType.baseIncome,
          purchase_price: wellType.price
        })
        .select()
        .single();

      if (wellError) throw wellError;

      // Update profile balance and daily income
      const newBalance = profile.balance - wellType.price;
      const newDailyIncome = profile.total_daily_income + wellType.baseIncome;

      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          balance: newBalance,
          total_daily_income: newDailyIncome
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update local state
      setWells(prev => [...prev, newWell]);
      setProfile(prev => prev ? {
        ...prev,
        balance: newBalance,
        total_daily_income: newDailyIncome
      } : null);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const upgradeWell = async (wellId: string) => {
    if (!hasSupabase || !user || !profile) return { success: false, error: 'Не авторизован' };

    const well = wells.find(w => w.id === wellId);
    if (!well || well.level >= 20) return { success: false, error: 'Нельзя улучшить' };

    const upgradeCost = Math.round(well.purchase_price * 0.5 * well.level);
    if (profile.balance < upgradeCost) {
      return { success: false, error: 'Недостаточно средств' };
    }

    try {
      const newLevel = well.level + 1;
      const newIncome = Math.round(well.income_per_day * 1.3);
      const incomeIncrease = newIncome - well.income_per_day;

      // Update well
      const { error: wellError } = await supabase
        .from('user_wells')
        .update({
          level: newLevel,
          income_per_day: newIncome
        })
        .eq('id', wellId);

      if (wellError) throw wellError;

      // Update profile
      const newBalance = profile.balance - upgradeCost;
      const newDailyIncome = profile.total_daily_income + incomeIncrease;

      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          balance: newBalance,
          total_daily_income: newDailyIncome
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update local state
      setWells(prev => prev.map(w => 
        w.id === wellId 
          ? { ...w, level: newLevel, income_per_day: newIncome }
          : w
      ));
      setProfile(prev => prev ? {
        ...prev,
        balance: newBalance,
        total_daily_income: newDailyIncome
      } : null);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const addIncome = async (amount: number) => {
    if (!hasSupabase || !user || !profile) return;

    try {
      const newBalance = profile.balance + amount;

      const { error } = await supabase
        .from('user_profiles')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (!error) {
        setProfile(prev => prev ? { ...prev, balance: newBalance } : null);
      }
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  return {
    profile,
    wells,
    loading,
    buyWell,
    upgradeWell,
    addIncome,
    reload: loadGameData
  };
}