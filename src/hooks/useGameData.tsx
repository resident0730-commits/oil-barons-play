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

export interface BoosterType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  effect: string;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  bonusPerLevel: number;
  duration: number | null; // null = permanent, number = milliseconds
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'temporary';
}

export interface UserBooster {
  id: string;
  user_id: string;
  booster_type: string;
  level: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export const wellTypes: WellType[] = [
  { 
    name: "Мини-скважина", 
    baseIncome: 100, 
    price: 1000, 
    maxLevel: 5, 
    icon: "🌱", 
    image: miniWellImg,
    rarity: 'common'
  },
  { 
    name: "Стартовая скважина", 
    baseIncome: 220, 
    price: 2000, 
    maxLevel: 10, 
    icon: "🔸", 
    image: starterWellImg,
    rarity: 'common'
  },
  { 
    name: "Средняя скважина", 
    baseIncome: 360, 
    price: 3000, 
    maxLevel: 15, 
    icon: "⚡", 
    image: mediumWellImg,
    rarity: 'common'
  },
  { 
    name: "Промышленная скважина", 
    baseIncome: 650, 
    price: 5000, 
    maxLevel: 20, 
    icon: "🏭", 
    image: industrialWellImg,
    rarity: 'uncommon'
  },
  { 
    name: "Супер скважина", 
    baseIncome: 1120, 
    price: 8000, 
    maxLevel: 25, 
    icon: "💎", 
    image: superWellImg,
    rarity: 'rare'
  },
  { 
    name: "Премиум скважина", 
    baseIncome: 1800, 
    price: 12000, 
    maxLevel: 30, 
    icon: "👑", 
    image: premiumWellImg,
    rarity: 'epic'
  },
  { 
    name: "Элитная скважина", 
    baseIncome: 2880, 
    price: 18000, 
    maxLevel: 35, 
    icon: "💠", 
    image: eliteWellImg,
    rarity: 'epic'
  },
  { 
    name: "Легендарная скважина", 
    baseIncome: 4590, 
    price: 27000, 
    maxLevel: 40, 
    icon: "🌟", 
    image: legendaryWellImg,
    rarity: 'legendary'
  },
  { 
    name: "Космическая скважина", 
    baseIncome: 7200, 
    price: 40000, 
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
    originalPrice: 5000,
    discountedPrice: 3800,
    discount: 24,
    icon: "🎯",
    image: starterPackageImg,
    rarity: 'starter',
    totalDailyIncome: 520 // 3*100 + 1*220
  },
  {
    name: "Пакет роста",
    description: "Для активного развития",
    wells: [
      { type: "Стартовая скважина", count: 2 },
      { type: "Средняя скважина", count: 2 },
      { type: "Промышленная скважина", count: 1 }
    ],
    originalPrice: 16000,
    discountedPrice: 12500,
    discount: 22,
    icon: "📈",
    image: growthPackageImg,
    rarity: 'growth',
    totalDailyIncome: 1450 // 2*220 + 2*360 + 1*650
  },
  {
    name: "Бизнес пакет",
    description: "Для серьезного бизнеса",
    wells: [
      { type: "Промышленная скважина", count: 3 },
      { type: "Супер скважина", count: 2 },
      { type: "Премиум скважина", count: 1 }
    ],
    originalPrice: 55000,
    discountedPrice: 42000,
    discount: 24,
    icon: "💼",
    image: businessPackageImg,
    rarity: 'business',
    totalDailyIncome: 6040 // 3*650 + 2*1120 + 1*1800
  },
  {
    name: "Империя",
    description: "Для нефтяных магнатов",
    wells: [
      { type: "Премиум скважина", count: 2 },
      { type: "Элитная скважина", count: 2 },
      { type: "Легендарная скважина", count: 1 }
    ],
    originalPrice: 96000,
    discountedPrice: 72000,
    discount: 25,
    icon: "👑",
    image: empirePackageImg,
    rarity: 'empire',
    totalDailyIncome: 13950 // 2*1800 + 2*2880 + 1*4590
  }
];

export function useGameData() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wells, setWells] = useState<UserWell[]>([]);
  const [boosters, setBoosters] = useState<UserBooster[]>([]);
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
        .maybeSingle();

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

      // Update profile balance and daily income with booster multiplier
      const newBalance = profile.balance - wellType.price;
      const multiplier = getActiveBoosterMultiplier();
      const totalDailyIncome = wells.reduce((sum, w) => sum + w.daily_income, 0) + wellType.baseIncome;
      const boostedDailyIncome = Math.round(totalDailyIncome * multiplier);

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          balance: newBalance,
          daily_income: boostedDailyIncome
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update local state
      setWells(prev => [...prev, newWell]);
      setProfile(prev => prev ? {
        ...prev,
        balance: newBalance,
        daily_income: boostedDailyIncome
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

      // Update profile balance and daily income with booster multiplier
      const newBalance = profile.balance - upgradeCost;
      const multiplier = getActiveBoosterMultiplier();
      const totalDailyIncome = wells.reduce((sum, w) => 
        w.id === wellId ? sum + newIncome : sum + w.daily_income, 0
      );
      const boostedDailyIncome = Math.round(totalDailyIncome * multiplier);

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          balance: newBalance,
          daily_income: boostedDailyIncome
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
        daily_income: boostedDailyIncome
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

      // Обновляем профиль с учетом бустеров
      const newBalance = profile.balance - wellPackage.discountedPrice;
      const multiplier = getActiveBoosterMultiplier();
      const currentDailyIncome = wells.reduce((sum, w) => sum + w.daily_income, 0);
      const boostedDailyIncome = Math.round((currentDailyIncome + totalDailyIncome) * multiplier);

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          balance: newBalance,
          daily_income: boostedDailyIncome
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Обновляем локальное состояние
      setWells(prev => [...prev, ...newWells]);
      setProfile(prev => prev ? {
        ...prev,
        balance: newBalance,
        daily_income: boostedDailyIncome
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

  const buyBooster = async (boosterId: string, cost: number, duration: number | null) => {
    if (!user || !profile) {
      return { success: false, error: 'Пользователь не авторизован' };
    }

    if (profile.balance < cost) {
      return { success: false, error: 'Недостаточно средств' };
    }

    try {
      // Check if booster already exists
      const { data: existingBooster } = await supabase
        .from('user_boosters')
        .select('*')
        .eq('user_id', user.id)
        .eq('booster_type', boosterId)
        .single();

      let boosterQuery;
      
      if (existingBooster) {
        // Update existing booster
        const newLevel = existingBooster.level + 1;
        const expiresAt = duration ? new Date(Date.now() + duration).toISOString() : null;
        
        boosterQuery = supabase
          .from('user_boosters')
          .update({ 
            level: newLevel,
            expires_at: expiresAt,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingBooster.id);
      } else {
        // Create new booster
        const expiresAt = duration ? new Date(Date.now() + duration).toISOString() : null;
        
        boosterQuery = supabase
          .from('user_boosters')
          .insert({
            user_id: user.id,
            booster_type: boosterId,
            level: 1,
            expires_at: expiresAt
          });
      }

      const { error: boosterError } = await boosterQuery;
      if (boosterError) throw boosterError;

      // Update user balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: profile.balance - cost })
        .eq('user_id', user.id);

      if (balanceError) throw balanceError;

      // Reload data and recalculate daily income
      await loadGameData();
      await recalculateDailyIncome();

      return { success: true };
    } catch (error) {
      console.error('Error buying booster:', error);
      return { success: false, error: 'Ошибка при покупке бустера' };
    }
  };

  const calculateBoosterMultiplier = (userBoosters: UserBooster[]) => {
    if (!userBoosters.length) return 1;

    let multiplier = 1;
    
    userBoosters.forEach(booster => {
      // Check if booster is still active
      const isActive = !booster.expires_at || new Date(booster.expires_at) > new Date();
      
      if (isActive) {
        switch (booster.booster_type) {
          case 'worker_crew':
            multiplier += (booster.level * 0.10); // 10% per level
            break;
          case 'geological_survey':
            multiplier += (booster.level * 0.15); // 15% per level
            break;
          case 'advanced_equipment':
            multiplier += (booster.level * 0.25); // 25% per level
            break;
          case 'turbo_boost':
            multiplier += 0.50; // 50% flat bonus
            break;
          case 'automation':
            multiplier += (booster.level * 0.20); // 20% per level
            break;
        }
      }
    });

    return multiplier;
  };

  const getActiveBoosterMultiplier = () => {
    return calculateBoosterMultiplier(boosters);
  };

  const recalculateDailyIncome = async () => {
    if (!user || !wells.length) return;

    try {
      // Calculate base income from wells
      const baseIncome = wells.reduce((total, well) => total + well.daily_income, 0);
      
      // Apply booster multiplier
      const multiplier = getActiveBoosterMultiplier();
      const totalIncome = Math.round(baseIncome * multiplier);

      // Update profile with new daily income
      const { error } = await supabase
        .from('profiles')
        .update({ daily_income: totalIncome })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setProfile(prev => prev ? { ...prev, daily_income: totalIncome } : null);
    } catch (error) {
      console.error('Error recalculating daily income:', error);
    }
  };

  return {
    profile,
    wells,
    boosters,
    loading,
    buyWell,
    buyPackage,
    upgradeWell,
    addIncome,
    buyBooster,
    getActiveBoosterMultiplier,
    recalculateDailyIncome,
    reload: loadGameData
  };
}