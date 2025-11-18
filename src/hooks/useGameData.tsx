import { useState, useEffect, useCallback } from 'react';
import type { ComponentType } from 'react';
import { useAuth } from './useAuth';
import { useStatusBonuses } from './useStatusBonuses';
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
  description: string;
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
  barrel_balance: number;
  oilcoin_balance: number;
  ruble_balance: number;
  daily_income: number;
  last_login: string;
  created_at?: string;
  updated_at?: string;
  last_bonus_claim?: string;
  last_barrel_claim?: string;
  status_titles?: string[];
  is_banned?: boolean;
  ban_reason?: string;
  banned_at?: string;
  banned_by?: string;
  referral_code?: string;
  referred_by?: string;
  referral_bonus_expires_at?: string;
  last_daily_chest_claim?: string;
  daily_chest_streak?: number;
  total_daily_chests_opened?: number;
}

export interface UserBooster {
  id: string;
  user_id: string;
  booster_type: string;
  level: number;
  expires_at?: string;
  created_at: string;
  updated_at: string;
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
  icon: string;
  effect: string;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  bonusPerLevel: number;
  duration: number | null; // null = permanent, number = milliseconds
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'temporary';
}

export interface PackageType {
  id: string;
  name: string;
  description: string;
  price: number;
  wells: { wellType: WellType; quantity: number; }[];
  bonuses: { type: string; value: number; duration?: number; }[];
  badge?: string;
  popular?: boolean;
  image: string;
}

export const wellTypes: WellType[] = [
  {
    name: 'Мини-скважина',
    description: 'Компактная установка идеальная для первых шагов в нефтяной индустрии. Простая в обслуживании и надёжная, станет отличным началом вашей империи.',
    baseIncome: 20000,
    price: 1000,
    maxLevel: 5,
    icon: '⛽',
    image: miniWellImg,
    rarity: 'common'
  },
  {
    name: 'Стартовая скважина',
    description: 'Проверенная временем установка с оптимизированной системой добычи. Обеспечивает стабильный доход и высокую эффективность работы.',
    baseIncome: 44000,
    price: 2000,
    maxLevel: 8,
    icon: '🛢️',
    image: starterWellImg,
    rarity: 'common'
  },
  {
    name: 'Средняя скважина',
    description: 'Сбалансированное решение с улучшенной системой извлечения. Оснащена современными датчиками контроля и автоматизированными процессами.',
    baseIncome: 72000,
    price: 3000,
    maxLevel: 10,
    icon: '⛽',
    image: mediumWellImg,
    rarity: 'uncommon'
  },
  {
    name: 'Промышленная скважина',
    description: 'Мощная установка промышленного класса с глубоким бурением. Использует передовые технологии для максимальной добычи нефти из сложных месторождений.',
    baseIncome: 130000,
    price: 5000,
    maxLevel: 12,
    icon: '🏭',
    image: industrialWellImg,
    rarity: 'rare'
  },
  {
    name: 'Супер-скважина',
    description: 'Высокотехнологичная установка с турбонаддувом и многоступенчатой системой очистки. Обеспечивает феноменальную производительность.',
    baseIncome: 224000,
    price: 8000,
    maxLevel: 15,
    icon: '⚡',
    image: superWellImg,
    rarity: 'epic'
  },
  {
    name: 'Премиум-скважина',
    description: 'Эксклюзивная установка с алмазным буровым оборудованием и системой искусственного интеллекта. Максимальная эффективность добычи.',
    baseIncome: 360000,
    price: 12000,
    maxLevel: 18,
    icon: '💎',
    image: premiumWellImg,
    rarity: 'epic'
  },
  {
    name: 'Элитная скважина',
    description: 'Королевская установка с позолоченными элементами и квантовыми сенсорами. Символ статуса и технологического превосходства в нефтяной индустрии.',
    baseIncome: 576000,
    price: 18000,
    maxLevel: 20,
    icon: '👑',
    image: eliteWellImg,
    rarity: 'legendary'
  },
  {
    name: 'Легендарная скважина',
    description: 'Мифическая установка, созданная лучшими инженерами планеты. Использует нанотехнологии и квантовые процессоры для невероятной производительности.',
    baseIncome: 918000,
    price: 27000,
    maxLevel: 25,
    icon: '🌟',
    image: legendaryWellImg,
    rarity: 'legendary'
  },
  {
    name: 'Космическая скважина',
    description: 'Футуристическая установка внеземных технологий с антигравитационным двигателем. Добывает нефть из параллельных измерений и космической пыли.',
    baseIncome: 1440000,
    price: 40000,
    maxLevel: 30,
    icon: '🚀',
    image: cosmicWellImg,
    rarity: 'mythic'
  }
];

export const packageTypes: PackageType[] = [
  {
    id: 'starter',
    name: 'Стартовый пакет',
    description: 'Отличный выбор для начинающих нефтяных магнатов',
    price: 15000,
    wells: [
      { wellType: wellTypes[1], quantity: 2 }, // Starter Well x2
      { wellType: wellTypes[2], quantity: 1 }  // Medium Well x1
    ],
    bonuses: [
      { type: 'balance', value: 5000 }
    ],
    badge: '+5000 OC',
    image: starterPackageImg
  },
  {
    id: 'growth',
    name: 'Пакет роста',
    description: 'Ускоренное развитие вашего нефтяного бизнеса',
    price: 75000,
    wells: [
      { wellType: wellTypes[2], quantity: 3 }, // Medium Well x3
      { wellType: wellTypes[3], quantity: 1 }  // Industrial Well x1
    ],
    bonuses: [
      { type: 'balance', value: 15000 },
      { type: 'booster', value: 1, duration: 7 * 24 * 60 * 60 * 1000 } // 7 дней
    ],
    badge: 'Популярный',
    popular: true,
    image: growthPackageImg
  },
  {
    id: 'business',
    name: 'Бизнес пакет',
    description: 'Профессиональный набор для серьезных инвесторов',
    price: 300000,
    wells: [
      { wellType: wellTypes[3], quantity: 2 }, // Industrial Well x2
      { wellType: wellTypes[4], quantity: 2 }  // Super Well x2
    ],
    bonuses: [
      { type: 'balance', value: 50000 },
      { type: 'booster', value: 2, duration: 14 * 24 * 60 * 60 * 1000 } // 14 дней
    ],
    badge: '+50000 OC',
    image: businessPackageImg
  },
  {
    id: 'empire',
    name: 'Имперский пакет',
    description: 'Максимальная мощность для создания нефтяной империи',
    price: 1000000,
    wells: [
      { wellType: wellTypes[5], quantity: 2 }, // Premium Well x2
      { wellType: wellTypes[6], quantity: 1 }  // Elite Well x1
    ],
    bonuses: [
      { type: 'balance', value: 200000 },
      { type: 'booster', value: 3, duration: 30 * 24 * 60 * 60 * 1000 } // 30 дней
    ],
    badge: 'Премиум',
    image: empirePackageImg
  }
];

export const wellPackages: WellPackage[] = [
  {
    name: 'Стартовый пакет',
    description: 'Первый шаг к нефтяному состоянию. Базовый набор скважин для стабильного дохода с первого дня.',
    wells: [
      { type: 'Мини-скважина', count: 3 },
      { type: 'Стартовая скважина', count: 1 }
    ],
    originalPrice: 5000,
    discountedPrice: 3800,
    discount: 24,
    icon: '📦',
    image: starterPackageImg,
    rarity: 'starter',
    totalDailyIncome: 104
  },
  {
    name: 'Пакет роста',
    description: 'Ускорьте развитие империи. Промышленные мощности и стабильный доход для агрессивного масштабирования.',
    wells: [
      { type: 'Стартовая скважина', count: 2 },
      { type: 'Средняя скважина', count: 2 },
      { type: 'Промышленная скважина', count: 1 }
    ],
    originalPrice: 16000,
    discountedPrice: 12500,
    discount: 22,
    icon: '🚀',
    image: growthPackageImg,
    rarity: 'growth',
    totalDailyIncome: 290
  },
  {
    name: 'Бизнес пакет',
    description: 'Для профессионалов индустрии. Премиальные активы с максимальной доходностью и быстрой окупаемостью.',
    wells: [
      { type: 'Промышленная скважина', count: 3 },
      { type: 'Супер-скважина', count: 2 },
      { type: 'Премиум-скважина', count: 1 }
    ],
    originalPrice: 55000,
    discountedPrice: 42000,
    discount: 24,
    icon: '🏢',
    image: businessPackageImg,
    rarity: 'business',
    totalDailyIncome: 1208
  },
  {
    name: 'Империя пакет',
    description: 'Абсолютное доминирование на рынке. Элитные и легендарные скважины для построения нефтяной империи.',
    wells: [
      { type: 'Премиум-скважина', count: 2 },
      { type: 'Элитная скважина', count: 2 },
      { type: 'Легендарная скважина', count: 1 }
    ],
    originalPrice: 96000,
    discountedPrice: 72000,
    discount: 25,
    icon: '👑',
    image: empirePackageImg,
    rarity: 'empire',
    totalDailyIncome: 2790
  }
];

export function useGameData() {
  const { user } = useAuth();
  const { statusMultiplier } = useStatusBonuses();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wells, setWells] = useState<UserWell[]>([]);
  const [boosters, setBoosters] = useState<UserBooster[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateOfflineIncome = useCallback(async (profileData: UserProfile) => {
    if (!user) return;

    const now = new Date();
    const lastLogin = new Date(profileData.last_login);
    const offlineTimeMs = now.getTime() - lastLogin.getTime();
    
    console.log('⏰ Calculating offline income...');
    console.log('📅 Last login:', lastLogin.toLocaleString());
    console.log('⌚ Offline time (hours):', Math.round(offlineTimeMs / (1000 * 60 * 60) * 100) / 100);
    
    // Minimum 1 minute offline to get income
    if (offlineTimeMs < 60000) {
      console.log('❌ Less than 1 minute offline, no income');
      return;
    }
    
    const offlineHours = Math.min(offlineTimeMs / (1000 * 60 * 60), 24); // Max 24 hours
    const hourlyIncome = profileData.daily_income / 24;
    const offlineIncome = Math.floor(hourlyIncome * offlineHours);
    
    console.log('💰 Hourly income:', hourlyIncome);
    console.log('💰 Offline income:', offlineIncome);
    
    if (offlineIncome > 10) { // Minimum 10 OC to add
      const { error } = await supabase
        .from('profiles')
        .update({ balance: profileData.balance + offlineIncome })
        .eq('user_id', user.id);
        
      if (!error) {
        profileData.balance += offlineIncome;
        console.log('✅ Added offline income:', offlineIncome, 'New balance:', profileData.balance);
      }
    }
  }, [user?.id]);

  const calculateBoosterMultiplier = useCallback((activeBoosters: UserBooster[]) => {
    let totalBonus = 0;
    
    activeBoosters.forEach(booster => {
      // Check if booster is still active
      const isActive = !booster.expires_at || new Date(booster.expires_at) > new Date();
      
      if (isActive) {
        switch (booster.booster_type) {
          case 'worker_crew':
            totalBonus += booster.level * 15; // 15% per level
            break;
          case 'geological_survey':
            totalBonus += booster.level * 25; // 25% per level
            break;
          case 'advanced_equipment':
            totalBonus += booster.level * 35; // 35% per level
            break;
          case 'turbo_boost':
            totalBonus += booster.level * 50; // 50% per level
            break;
          case 'automation':
            totalBonus += booster.level * 20; // 20% per level
            break;
        }
      }
    });
    
    // Convert percentage to multiplier and round to avoid floating point issues
    return Math.round((1 + totalBonus / 100) * 1000) / 1000;
  }, []);

  const recalculateDailyIncome = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch fresh wells and boosters to avoid stale state
      const [{ data: wellsData }, { data: boostersData }] = await Promise.all([
        supabase.from('wells').select('*').eq('user_id', user.id),
        supabase.from('user_boosters').select('*').eq('user_id', user.id)
      ]);

      const safeWells = wellsData || [];
      const safeBoosters = boostersData || [];

      console.log('🔍 Recalculating income for user:', user.id);
      console.log('📊 Wells found:', safeWells.length, safeWells);
      console.log('🚀 Boosters found:', safeBoosters.length, safeBoosters);

      // Calculate base income from wells
      const baseIncome = safeWells.reduce((total, well) => total + well.daily_income, 0);
      
      // Apply booster and status multipliers
      const boosterMultiplier = calculateBoosterMultiplier(safeBoosters);
      const totalMultiplier = boosterMultiplier * statusMultiplier;
      const totalIncome = Math.floor(baseIncome * totalMultiplier);

      console.log('💰 Base income from wells:', baseIncome);
      console.log('🔢 Status multiplier:', statusMultiplier);
      console.log('🚀 Booster multiplier:', boosterMultiplier);
      console.log('📈 Total multiplier:', totalMultiplier);
      console.log('💎 Final total income:', totalIncome);

      // Update profile with new daily income
      const { error } = await supabase
        .from('profiles')
        .update({ daily_income: totalIncome })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state for UI consistency
      setWells(safeWells);
      setBoosters(safeBoosters);
      setProfile(prev => prev ? { ...prev, daily_income: totalIncome } : null);
      
    } catch (error) {
      console.error('Error recalculating daily income:', error);
    }
  }, [user?.id, statusMultiplier, calculateBoosterMultiplier]);

  const loadGameData = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Loading game data for user:', user.id, forceRefresh ? '(forced refresh)' : '');
      console.log('📱 User agent:', navigator.userAgent);
      console.log('📶 Connection:', navigator.onLine ? 'Online' : 'Offline');
      
      // Load profile with extended timeout for mobile devices
      const profileStartTime = Date.now();
      
      // Add cache-busting header if force refresh
      const query = supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id);
      
      const result = await Promise.race([
        forceRefresh 
          ? query.maybeSingle() 
          : query.maybeSingle(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile load timeout')), 15000) // Increased to 15 seconds
        )
      ]).catch(err => {
        console.error('❌ Profile loading error:', err);
        console.error('⏱️ Profile load time:', Date.now() - profileStartTime, 'ms');
        return { data: null, error: err };
      }) as { data: any; error: any };
      
      console.log('⏱️ Profile load time:', Date.now() - profileStartTime, 'ms');

      const profileData = result.data;
      const profileError = result.error;

      if (profileError) {
        console.error('❌ Profile loading failed:', profileError);
        setProfile(null);
      } else if (profileData) {
        console.log('✅ Profile loaded:', profileData);
        
        // Calculate and add offline income (non-blocking)
        if (profileData.last_login && profileData.daily_income > 0) {
          try {
            await calculateOfflineIncome(profileData);
          } catch (error) {
            console.error('Offline income error:', error);
          }
        }

        // Update last_login to current time (non-blocking)
        try {
          await supabase
            .from('profiles')
            .update({ last_login: new Date().toISOString() })
            .eq('user_id', user.id);
          console.log('✅ Last login updated');
        } catch (error) {
          console.error('Last login update error:', error);
        }

        setProfile({ ...profileData });
      } else {
        console.log('❌ No profile found, user needs setup');
        setProfile(null);
      }

      // Load wells with timeout protection
      try {
        console.log('🔍 Loading wells for user:', user.id);
        const { data: wellsData, error: wellsError } = await supabase
          .from('wells')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (wellsError) {
          console.error('❌ Wells loading error:', wellsError);
          console.error('Wells error details:', wellsError.message, wellsError.code);
          setWells([]);
        } else {
          console.log('⚡ Wells loaded successfully:', wellsData?.length || 0, 'wells');
          if (wellsData && wellsData.length > 0) {
            console.log('Wells data:', wellsData);
          } else {
            console.log('ℹ️ No wells found for user');
          }
          setWells(wellsData || []);
        }
      } catch (error) {
        console.error('❌ Wells loading failed:', error);
        setWells([]);
      }

      // Load boosters with timeout protection
      try {
        const { data: boostersData, error: boostersError } = await supabase
          .from('user_boosters')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (boostersError) {
          console.error('❌ Boosters loading error:', boostersError);
          setBoosters([]);
        } else {
          console.log('🚀 Boosters loaded:', boostersData?.length || 0, boostersData);
          setBoosters(boostersData || []);
        }
      } catch (error) {
        console.error('❌ Boosters loading failed:', error);
        setBoosters([]);
      }

      // Recalculate daily income to ensure it's accurate (non-blocking)
      setTimeout(() => {
        try {
          recalculateDailyIncome();
        } catch (error) {
          console.error('❌ Daily income recalculation error:', error);
        }
      }, 100);

    } catch (error) {
      console.error('❌ Fatal error loading game data:', error);
      setProfile(null);
      setWells([]);
      setBoosters([]);
    } finally {
      setLoading(false);
      console.log('✅ Game data loading completed');
    }
  }, [user?.id, recalculateDailyIncome, calculateOfflineIncome]);

  // Load user data when user changes
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadGameData();
  }, [user?.id, loadGameData]);

  const addIncome = useCallback(async (amount: number) => {
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
  }, [user?.id, profile?.balance]);

  const buyWell = async (wellType: WellType) => {
    if (!user || !profile) {
      return { success: false, error: 'Пользователь не авторизован' };
    }

    if (profile.balance < wellType.price) {
      return { success: false, error: 'Недостаточно средств' };
    }

    try {
      // Calculate income for level 1 using the same formula as upgrades
      const level = 1;
      const dailyIncome = Math.floor(wellType.baseIncome * (1 + (level - 1) * 0.5));
      
      // Create well record
      const { error: wellError } = await supabase
        .from('wells')
        .insert({
          user_id: user.id,
          well_type: wellType.name,
          level: level,
          daily_income: dailyIncome
        });

      if (wellError) throw wellError;

      // Update profile balance
      const newBalance = profile.balance - wellType.price;
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update local state
      setProfile(prev => prev ? { ...prev, balance: newBalance } : null);

      // Reload game data to get updated wells
      setTimeout(() => loadGameData(), 100);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const buyWellPackage = async (wellPackage: WellPackage) => {
    if (!user || !profile) {
      return { success: false, error: 'Пользователь не авторизован' };
    }

    if (profile.balance < wellPackage.discountedPrice) {
      return { success: false, error: 'Недостаточно средств' };
    }

    try {
      // Create wells from package based on WellPackage structure
      const wellPromises = wellPackage.wells.map(({ type, count }) => {
        const wellType = wellTypes.find(wt => wt.name === type);
        if (!wellType) throw new Error(`Well type ${type} not found`);
        
        // Calculate income for level 1 using the same formula as upgrades
        const level = 1;
        const dailyIncome = Math.floor(wellType.baseIncome * (1 + (level - 1) * 0.5));
        
        return Array.from({ length: count }, () =>
          supabase.from('wells').insert({
            user_id: user.id,
            well_type: wellType.name,
            level: level,
            daily_income: dailyIncome
          })
        );
      }).flat();

      await Promise.all(wellPromises);

      // Update profile balance
      const newBalance = profile.balance - wellPackage.discountedPrice;
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update local state
      setProfile(prev => prev ? { ...prev, balance: newBalance } : null);

      // Reload game data
      setTimeout(() => loadGameData(), 100);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const buyPackage = async (packageType: PackageType) => {
    if (!user || !profile) {
      return { success: false, error: 'Пользователь не авторизован' };
    }

    if (profile.balance < packageType.price) {
      return { success: false, error: 'Недостаточно средств' };
    }

    try {
      // Create wells from package
      const wellPromises = packageType.wells.map(({ wellType, quantity }) => {
        return Array.from({ length: quantity }, () =>
          supabase.from('wells').insert({
            user_id: user.id,
            well_type: wellType.name,
            level: 1,
            daily_income: wellType.baseIncome
          })
        );
      }).flat();

      await Promise.all(wellPromises);

      // Apply bonuses
      let balanceBonus = 0;
      for (const bonus of packageType.bonuses) {
        if (bonus.type === 'balance') {
          balanceBonus += bonus.value;
        }
      }

      // Update profile balance
      const newBalance = profile.balance - packageType.price + balanceBonus;
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update local state
      setProfile(prev => prev ? { ...prev, balance: newBalance } : null);

      // Reload game data
      setTimeout(() => loadGameData(), 100);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const upgradeWell = async (wellId: string) => {
    if (!user || !profile) {
      return { success: false, error: 'Пользователь не авторизован' };
    }

    try {
      const well = wells.find(w => w.id === wellId);
      if (!well) {
        return { success: false, error: 'Скважина не найдена' };
      }

      const wellType = wellTypes.find(wt => wt.name === well.well_type);
      if (!wellType) {
        return { success: false, error: 'Тип скважины не найден' };
      }

      if (well.level >= wellType.maxLevel) {
        return { success: false, error: 'Достигнут максимальный уровень' };
      }

      const upgradeCost = Math.round(wellType.price * 0.5 * Math.pow(1.2, well.level - 1));
      if (profile.balance < upgradeCost) {
        return { success: false, error: 'Недостаточно средств для улучшения' };
      }

      const newLevel = well.level + 1;
      const newDailyIncome = Math.floor(wellType.baseIncome * (1 + (newLevel - 1) * 0.5));

      // Update well
      const { error: wellError } = await supabase
        .from('wells')
        .update({
          level: newLevel,
          daily_income: newDailyIncome
        })
        .eq('id', wellId);

      if (wellError) throw wellError;

      // Update profile balance
      const newBalance = profile.balance - upgradeCost;
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update local state
      setProfile(prev => prev ? { ...prev, balance: newBalance } : null);

      // Reload to recalculate daily income
      setTimeout(() => loadGameData(), 100);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
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
        .maybeSingle();

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

      // Update balance
      const newBalance = profile.balance - cost;
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (balanceError) throw balanceError;

      setProfile(prev => prev ? { ...prev, balance: newBalance } : null);

      // Reload game data to get fresh boosters and recalculate daily income
      setTimeout(() => loadGameData(), 100);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const cancelBooster = async (boosterId: string) => {
    if (!user || !profile) {
      return { success: false, error: 'Пользователь не авторизован' };
    }

    const existingBooster = boosters.find(b => b.booster_type === boosterId);
    if (!existingBooster) {
      return { success: false, error: 'Бустер не найден' };
    }

    // Проверяем, что бустер еще активен
    const isActive = !existingBooster.expires_at || new Date(existingBooster.expires_at) > new Date();
    if (!isActive) {
      return { success: false, error: 'Нельзя отменить истекший бустер' };
    }

    try {
      // Рассчитываем возврат средств (50% от последней потраченной суммы)
      const boosterTypes = [
        { id: 'worker_crew', baseCost: 5000, costMultiplier: 1.8 },
        { id: 'geological_survey', baseCost: 8000, costMultiplier: 2.0 },
        { id: 'advanced_equipment', baseCost: 15000, costMultiplier: 2.2 },
        { id: 'turbo_boost', baseCost: 3000, costMultiplier: 1.0 },
        { id: 'automation', baseCost: 20000, costMultiplier: 2.5 }
      ];

      const boosterType = boosterTypes.find(bt => bt.id === boosterId);
      if (!boosterType) {
        return { success: false, error: 'Неизвестный тип бустера' };
      }

      // Рассчитываем стоимость последнего уровня
      const lastLevelCost = Math.floor(boosterType.baseCost * Math.pow(boosterType.costMultiplier, existingBooster.level - 1));
      const refundAmount = Math.floor(lastLevelCost * 0.5); // 50% возврат

      // Удаляем бустер или понижаем уровень
      if (existingBooster.level === 1) {
        // Удаляем бустер полностью
        const { error: deleteError } = await supabase
          .from('user_boosters')
          .delete()
          .eq('id', existingBooster.id);

        if (deleteError) throw deleteError;
      } else {
        // Понижаем уровень на 1
        const { error: updateError } = await supabase
          .from('user_boosters')
          .update({
            level: existingBooster.level - 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingBooster.id);

        if (updateError) throw updateError;
      }

      // Возвращаем средства
      const newBalance = profile.balance + refundAmount;
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (balanceError) throw balanceError;

      setProfile(prev => prev ? { ...prev, balance: newBalance } : null);

      // Reload game data to refresh boosters and recalculate daily income
      setTimeout(() => loadGameData(), 100);

      return { success: true, refundAmount };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getActiveBoosterMultiplier = () => {
    const boosterMultiplier = calculateBoosterMultiplier(boosters);
    return boosterMultiplier * statusMultiplier;
  };

  return {
    profile,
    wells,
    boosters,
    loading,
    buyWell,
    buyPackage,
    buyWellPackage,
    upgradeWell,
    addIncome,
    buyBooster,
    cancelBooster,
    getActiveBoosterMultiplier,
    recalculateDailyIncome,
    reload: (forceRefresh?: boolean) => loadGameData(forceRefresh)
  };
}