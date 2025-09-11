import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

// Import well images
import miniWellImg from '@/assets/wells/mini-well-art.jpg';
import starterWellImg from '@/assets/wells/starter-well-art.jpg';
import mediumWellImg from '@/assets/wells/medium-well-art.jpg';
import industrialWellImg from '@/assets/wells/industrial-well-art.jpg';
import superWellImg from '@/assets/wells/super-well-art.jpg';
import premiumWellImg from '@/assets/wells/premium-well-art.jpg';
import eliteWellImg from '@/assets/wells/elite-well-art.jpg';
import legendaryWellImg from '@/assets/wells/legendary-well-art.jpg';
import cosmicWellImg from '@/assets/wells/cosmic-well-art.jpg';

// Import package images
import starterPackageImg from '@/assets/packages/starter-package.jpg';
import growthPackageImg from '@/assets/packages/growth-package.jpg';
import businessPackageImg from '@/assets/packages/business-package.jpg';
import empirePackageImg from '@/assets/packages/empire-package.jpg';

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

export interface WellPackage {
  name: string;
  description: string;
  wells: { type: string; count: number }[];
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  icon: string;
  image: string;
  rarity: 'starter' | 'growth' | 'business' | 'empire';
  totalDailyIncome: number;
}

export const wellTypes: WellType[] = [
  { 
    name: "Мини-скважина", 
    baseIncome: 3, 
    price: 750, 
    maxLevel: 5, 
    icon: "🌱", 
    image: miniWellImg,
    rarity: 'common'
  },
  { 
    name: "Стартовая скважина", 
    baseIncome: 7, 
    price: 2000, 
    maxLevel: 10, 
    icon: "🔸", 
    image: starterWellImg,
    rarity: 'common'
  },
  { 
    name: "Средняя скважина", 
    baseIncome: 21, 
    price: 5500, 
    maxLevel: 15, 
    icon: "⚡", 
    image: mediumWellImg,
    rarity: 'common'
  },
  { 
    name: "Промышленная скважина", 
    baseIncome: 60, 
    price: 15000, 
    maxLevel: 20, 
    icon: "🏭", 
    image: industrialWellImg,
    rarity: 'uncommon'
  },
  { 
    name: "Супер скважина", 
    baseIncome: 170, 
    price: 42000, 
    maxLevel: 25, 
    icon: "💎", 
    image: superWellImg,
    rarity: 'rare'
  },
  { 
    name: "Премиум скважина", 
    baseIncome: 493, 
    price: 120000, 
    maxLevel: 30, 
    icon: "👑", 
    image: premiumWellImg,
    rarity: 'epic'
  },
  { 
    name: "Элитная скважина", 
    baseIncome: 1488, 
    price: 350000, 
    maxLevel: 35, 
    icon: "💠", 
    image: eliteWellImg,
    rarity: 'epic'
  },
  { 
    name: "Легендарная скважина", 
    baseIncome: 4329, 
    price: 1000000, 
    maxLevel: 40, 
    icon: "🌟", 
    image: legendaryWellImg,
    rarity: 'legendary'
  },
  { 
    name: "Космическая скважина", 
    baseIncome: 13151, 
    price: 3000000, 
    maxLevel: 50, 
    icon: "🚀", 
    image: cosmicWellImg,
    rarity: 'mythic'
  }
];

export const wellPackages: WellPackage[] = [
  {
    name: "Стартовый пакет",
    description: "Идеально для новичков",
    wells: [
      { type: "Мини-скважина", count: 3 },
      { type: "Стартовая скважина", count: 1 }
    ],
    originalPrice: 4250,
    discountedPrice: 3200,
    discount: 25,
    icon: "🎯",
    image: starterPackageImg,
    rarity: 'starter',
    totalDailyIncome: 16 // 3*3 + 1*7
  },
  {
    name: "Пакет роста",
    description: "Для активного развития",
    wells: [
      { type: "Стартовая скважина", count: 2 },
      { type: "Средняя скважина", count: 2 },
      { type: "Промышленная скважина", count: 1 }
    ],
    originalPrice: 30000,
    discountedPrice: 23000,
    discount: 23,
    icon: "📈",
    image: growthPackageImg,
    rarity: 'growth',
    totalDailyIncome: 116 // 2*7 + 2*21 + 1*60
  },
  {
    name: "Бизнес пакет",
    description: "Для серьезного бизнеса",
    wells: [
      { type: "Промышленная скважина", count: 3 },
      { type: "Супер скважина", count: 2 },
      { type: "Премиум скважина", count: 1 }
    ],
    originalPrice: 249000,
    discountedPrice: 190000,
    discount: 24,
    icon: "💼",
    image: businessPackageImg,
    rarity: 'business',
    totalDailyIncome: 1013 // 3*60 + 2*170 + 1*493
  },
  {
    name: "Империя",
    description: "Для нефтяных магнатов",
    wells: [
      { type: "Премиум скважина", count: 2 },
      { type: "Элитная скважина", count: 2 },
      { type: "Легендарная скважина", count: 1 }
    ],
    originalPrice: 1940000,
    discountedPrice: 1450000,
    discount: 25,
    icon: "👑",
    image: empirePackageImg,
    rarity: 'empire',
    totalDailyIncome: 8291 // 2*493 + 2*1488 + 1*4329
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
    const wellType = wellTypes.find(wt => wt.name === well?.well_type);
    
    if (!well || !wellType || well.level >= wellType.maxLevel) {
      return { success: false, error: 'Нельзя улучшить' };
    }

    const upgradeCost = Math.round((wellType.price * 0.3 * well.level));
    if (profile.balance < upgradeCost) {
      return { success: false, error: 'Недостаточно средств' };
    }

    try {
      const newLevel = well.level + 1;
      // Каждый уровень увеличивает доход на 15%
      const newIncome = Math.round(well.daily_income * 1.15);
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

  const buyPackage = async (wellPackage: WellPackage) => {
    if (!user || !profile) return { success: false, error: 'Не авторизован' };

    if (profile.balance < wellPackage.discountedPrice) {
      return { success: false, error: 'Недостаточно средств' };
    }

    try {
      let totalDailyIncome = 0;
      const newWells = [];

      // Создаем скважины из пакета
      for (const packageWell of wellPackage.wells) {
        const wellType = wellTypes.find(wt => wt.name === packageWell.type);
        if (!wellType) continue;

        for (let i = 0; i < packageWell.count; i++) {
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
          
          newWells.push(newWell);
          totalDailyIncome += wellType.baseIncome;
        }
      }

      // Обновляем профиль
      const newBalance = profile.balance - wellPackage.discountedPrice;
      const newDailyIncome = profile.daily_income + totalDailyIncome;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          balance: newBalance,
          daily_income: newDailyIncome
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Обновляем локальное состояние
      setWells(prev => [...prev, ...newWells]);
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
    buyPackage,
    upgradeWell,
    addIncome,
    reload: loadGameData
  };
}