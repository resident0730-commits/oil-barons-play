import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Gift, Lock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  reward_type: string;
  reward_amount: number;
  reward_data: any;
  requirement_type: string;
  requirement_value: number;
}

interface UserAchievement {
  id: string;
  achievement_id: string;
  unlocked_at: string;
  claimed: boolean;
  claimed_at: string | null;
}

export const AchievementsSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userStats, setUserStats] = useState<any>({});

  useEffect(() => {
    if (user) {
      fetchAchievements();
      fetchUserAchievements();
      fetchUserStats();
    }
  }, [user]);

  const fetchAchievements = async () => {
    const { data } = await supabase
      .from('achievements')
      .select('*')
      .order('category, requirement_value');

    if (data) {
      setAchievements(data);
    }
  };

  const fetchUserAchievements = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user.id);

    if (data) {
      setUserAchievements(data);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    // Fetch various user statistics needed for achievement calculations
    const [
      { data: profile },
      { data: wells },
      { data: boosters },
      { data: referrals }
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('wells').select('*').eq('user_id', user.id),
      supabase.from('user_boosters').select('*').eq('user_id', user.id),
      supabase.from('referrals').select('*').eq('referrer_id', user.id)
    ]);

    const wellTypes = new Set(wells?.map(w => w.well_type) || []);
    const boosterTypes = new Set(boosters?.map(b => b.booster_type) || []);
    const cosmicWells = wells?.filter(w => w.well_type === 'cosmic') || [];

    setUserStats({
      balance: profile?.balance || 0,
      wellsCount: wells?.length || 0,
      wellTypes: wellTypes.size,
      boosterTypes: boosterTypes.size,
      referralsCount: referrals?.length || 0,
      cosmicWell: cosmicWells.length,
      // Add more stats as needed
    });
  };

  const calculateProgress = (achievement: Achievement) => {
    const userValue = userStats[achievement.requirement_type] || 0;
    return Math.min((userValue / achievement.requirement_value) * 100, 100);
  };

  const isUnlocked = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId);
  };

  const isClaimed = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId && ua.claimed);
  };

  const canUnlock = (achievement: Achievement) => {
    const progress = calculateProgress(achievement);
    return progress >= 100 && !isUnlocked(achievement.id);
  };

  const unlockAchievement = async (achievement: Achievement) => {
    if (!user || !canUnlock(achievement)) return;

    try {
      await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievement.id
        });

      await fetchUserAchievements();
      
      toast({
        title: "Достижение разблокировано!",
        description: `${achievement.icon} ${achievement.title}`,
      });

      // Check if achievement is automatically claimable
      if (achievement.reward_type === 'coins' || achievement.reward_type === 'booster') {
        setTimeout(() => claimReward(achievement), 1000);
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };

  const claimReward = async (achievement: Achievement) => {
    if (!user) return;

    try {
      if (achievement.reward_type === 'coins' && achievement.reward_amount > 0) {
        // Add coins to user balance
        const { data: profile } = await supabase
          .from('profiles')
          .select('balance')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({ 
              balance: profile.balance + achievement.reward_amount 
            })
            .eq('user_id', user.id);
        }
      }

      // Mark achievement as claimed
      await supabase
        .from('user_achievements')
        .update({ 
          claimed: true,
          claimed_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('achievement_id', achievement.id);

      await fetchUserAchievements();
      
      toast({
        title: "Награда получена!",
        description: getRewardText(achievement),
      });
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  const getRewardText = (achievement: Achievement) => {
    switch (achievement.reward_type) {
      case 'coins':
        return `+${achievement.reward_amount.toLocaleString()} OC`;
      case 'booster':
        return 'Бустер добавлен в инвентарь';
      case 'title':
        if (achievement.name === 'oil_king') {
          return 'Статус "Нефтяной король"';
        } else if (achievement.name === 'leader') {
          return 'Статус "Лидер"';
        } else if (achievement.name === 'ambassador') {
          return 'Статус "Амбассадор"';
        }
        return 'Эксклюзивный статус';
      case 'discount':
        return `${achievement.reward_amount}% скидка активирована`;
      default:
        return 'Награда получена';
    }
  };

  const categories = [
    { id: 'all', name: 'Все', icon: Trophy },
    { id: 'magnate', name: 'Магнат', icon: Trophy },
    { id: 'collector', name: 'Коллекционер', icon: Gift },
    { id: 'activity', name: 'Активность', icon: CheckCircle },
    { id: 'social', name: 'Социальные', icon: Gift }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Достижения
          </CardTitle>
          <CardDescription>
            Выполняйте задания и получайте награды
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              <category.icon className="h-4 w-4 mr-1" />
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAchievements.map((achievement) => {
            const unlocked = isUnlocked(achievement.id);
            const claimed = isClaimed(achievement.id);
            const progress = calculateProgress(achievement);
            const canUnlockNow = canUnlock(achievement);

            return (
              <Card key={achievement.id} className={`relative ${unlocked ? 'border-gold' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <CardTitle className="text-base">{achievement.title}</CardTitle>
                        <Badge variant={unlocked ? "default" : "secondary"} className="mt-1">
                          {achievement.category === 'magnate' && 'Магнат'}
                          {achievement.category === 'collector' && 'Коллекционер'}
                          {achievement.category === 'activity' && 'Активность'}
                          {achievement.category === 'social' && 'Социальное'}
                        </Badge>
                      </div>
                    </div>
                    {unlocked && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {!unlocked && progress < 100 && (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                  
                  {!unlocked && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Прогресс</span>
                        <span>{Math.floor(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-medium">Награда: </span>
                      <span className="text-muted-foreground">
                        {getRewardText(achievement)}
                      </span>
                    </div>
                    
                    {canUnlockNow && (
                      <Button 
                        size="sm" 
                        onClick={() => unlockAchievement(achievement)}
                      >
                        Получить
                      </Button>
                    )}
                    
                    {unlocked && !claimed && achievement.reward_type !== 'title' && (
                      <Button 
                        size="sm" 
                        onClick={() => claimReward(achievement)}
                        variant="outline"
                      >
                        Забрать
                      </Button>
                    )}
                    
                    {claimed && (
                      <Badge variant="outline">Получено</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Tabs>
    </div>
  );
};