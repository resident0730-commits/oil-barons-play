import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

// Import well images
import starterWellImg from '@/assets/wells/starter-well-art.jpg';
import mediumWellImg from '@/assets/wells/medium-well-art.jpg';
import industrialWellImg from '@/assets/wells/industrial-well-art.jpg';
import superWellImg from '@/assets/wells/super-well-art.jpg';
import premiumWellImg from '@/assets/wells/premium-well-art.jpg';
import eliteWellImg from '@/assets/wells/elite-well-art.jpg';
import legendaryWellImg from '@/assets/wells/legendary-well-art.jpg';
import cosmicWellImg from '@/assets/wells/cosmic-well-art.jpg';

export interface WellType {
  name: string;
  baseIncome: number;
  price: number;
  maxLevel: number;
  icon: string;
  image: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
}

export interface UserWell {
  id: string;
  well_type: string;
  level: number;
  daily_income: number;
}

export interface UserProfile {
  id: string;
  user_id: string;
  nickname: string;
  balance: number;
  daily_income: number;
}

export const wellTypes: WellType[] = [
  { 
    name: "Стартовая скважина", 
    baseIncome: 50, 
    price: 500, 
    maxLevel: 5, 
    icon: "🔸", 
    image: starterWellImg,
    rarity: 'common'
  },
  { 
    name: "Средняя скважина", 
    baseIncome: 150, 
    price: 1500, 
    maxLevel: 10, 
    icon: "⚡", 
    image: mediumWellImg,
    rarity: 'common'
  },
  { 
    name: "Промышленная скважина", 
    baseIncome: 500, 
    price: 5000, 
    maxLevel: 15, 
    icon: "🏭", 
    image: industrialWellImg,
    rarity: 'uncommon'
  },
  { 
    name: "Супер скважина", 
    baseIncome: 1500, 
    price: 15000, 
    maxLevel: 20, 
    icon: "💎", 
    image: superWellImg,
    rarity: 'rare'
  },
  { 
    name: "Премиум скважина", 
    baseIncome: 4000, 
    price: 40000, 
    maxLevel: 25, 
    icon: "👑", 
    image: premiumWellImg,
    rarity: 'epic'
  },
  { 
    name: "Элитная скважина", 
    baseIncome: 10000, 
    price: 100000, 
    maxLevel: 30, 
    icon: "💠", 
    image: eliteWellImg,
    rarity: 'epic'
  },
  { 
    name: "Легендарная скважина", 
    baseIncome: 25000, 
    price: 250000, 
    maxLevel: 35, 
    icon: "🌟", 
    image: legendaryWellImg,
    rarity: 'legendary'
  },
  { 
    name: "Космическая скважина", 
    baseIncome: 60000, 
    price: 600000, 
    maxLevel: 40, 
    icon: "🚀", 
    image: cosmicWellImg,
    rarity: 'mythic'
  }
];

export function useGameData() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wells, setWells] = useState<UserWell[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadGameData();
  }, [user]);

  const loadGameData = async () => {
    if (!user) return;

    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Load wells
      const { data: wellsData } = await supabase
        .from('wells')
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
    if (!user || !profile) return { success: false, error: 'Не авторизован' };

    if (profile.balance < wellType.price) {
      return { success: false, error: 'Недостаточно средств' };
    }

    try {
      // Insert new well
      const { data: newWell, error: wellError } = await supabase
        .from('wells')
        .insert({
          user_id: user.id,
          well_type: wellType.name,
          level: 1,
          daily_income: wellType.baseIncome
        })
        .select()
        .single();

      if (wellError) throw wellError;

      // Update profile balance and daily income
      const newBalance = profile.balance - wellType.price;
      const newDailyIncome = profile.daily_income + wellType.baseIncome;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          balance: newBalance,
          daily_income: newDailyIncome
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update local state
      setWells(prev => [...prev, newWell]);
      setProfile(prev => prev ? {
        ...prev,
        balance: newBalance,
        daily_income: newDailyIncome
      } : null);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const upgradeWell = async (wellId: string) => {
    if (!user || !profile) return { success: false, error: 'Не авторизован' };

    const well = wells.find(w => w.id === wellId);
    if (!well || well.level >= 20) return { success: false, error: 'Нельзя улучшить' };

    const upgradeCost = Math.round(wellTypes.find(wt => wt.name === well.well_type)?.price || 1000 * 0.5 * well.level);
    if (profile.balance < upgradeCost) {
      return { success: false, error: 'Недостаточно средств' };
    }

    try {
      const newLevel = well.level + 1;
      const newIncome = Math.round(well.daily_income * 1.3);
      const incomeIncrease = newIncome - well.daily_income;

      // Update well
      const { error: wellError } = await supabase
        .from('wells')
        .update({
          level: newLevel,
          daily_income: newIncome
        })
        .eq('id', wellId);

      if (wellError) throw wellError;

      // Update profile
      const newBalance = profile.balance - upgradeCost;
      const newDailyIncome = profile.daily_income + incomeIncrease;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          balance: newBalance,
          daily_income: newDailyIncome
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update local state
      setWells(prev => prev.map(w => 
        w.id === wellId 
          ? { ...w, level: newLevel, daily_income: newIncome }
          : w
      ));
      setProfile(prev => prev ? {
        ...prev,
        balance: newBalance,
        daily_income: newDailyIncome
      } : null);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const addIncome = async (amount: number) => {
    if (!user || !profile) return;

    try {
      const newBalance = profile.balance + amount;

      const { error } = await supabase
        .from('profiles')
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