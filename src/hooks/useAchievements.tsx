import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";

export const useAchievements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [checking, setChecking] = useState(false);

  const checkAchievements = async () => {
    if (!user || checking) return;
    
    setChecking(true);
    
    try {
      // Fetch user statistics
      const [
        { data: profile },
        { data: wells },
        { data: boosters },
        { data: referrals },
        { data: userAchievements },
        { data: achievements }
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('wells').select('*').eq('user_id', user.id),
        supabase.from('user_boosters').select('*').eq('user_id', user.id),
        supabase.from('referrals').select('*').eq('referrer_id', user.id),
        supabase.from('user_achievements').select('*').eq('user_id', user.id),
        supabase.from('achievements').select('*')
      ]);

      if (!profile || !achievements) return;

      const unlockedAchievementIds = new Set(userAchievements?.map(ua => ua.achievement_id) || []);
      const wellTypes = new Set(wells?.map(w => w.well_type) || []);
      const boosterTypes = new Set(boosters?.map(b => b.booster_type) || []);
      const cosmicWells = wells?.filter(w => w.well_type === 'cosmic') || [];

      const userStats = {
        balance: profile.balance || 0,
        wells_count: wells?.length || 0,
        well_types: wellTypes.size,
        booster_types: boosterTypes.size,
        referrals_count: referrals?.length || 0,
        cosmic_well: cosmicWells.length,
      };

      // Check each achievement
      for (const achievement of achievements) {
        if (unlockedAchievementIds.has(achievement.id)) continue;

        const userValue = userStats[achievement.requirement_type as keyof typeof userStats] || 0;
        
        if (userValue >= achievement.requirement_value) {
          // Unlock achievement
          await supabase
            .from('user_achievements')
            .insert({
              user_id: user.id,
              achievement_id: achievement.id
            });

          // Auto-claim certain rewards
          if (achievement.reward_type === 'coins' && achievement.reward_amount > 0) {
            await supabase
              .from('profiles')
              .update({ 
                balance: profile.balance + achievement.reward_amount 
              })
              .eq('user_id', user.id);

            await supabase
              .from('user_achievements')
              .update({ 
                claimed: true,
                claimed_at: new Date().toISOString()
              })
              .eq('user_id', user.id)
              .eq('achievement_id', achievement.id);

            toast({
              title: `Достижение разблокировано! ${achievement.icon}`,
              description: `${achievement.title} - Награда: +${achievement.reward_amount.toLocaleString()} OC`,
            });
          } else {
            toast({
              title: `Новое достижение! ${achievement.icon}`,
              description: achievement.title,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    } finally {
      setChecking(false);
    }
  };

  return { checkAchievements };
};