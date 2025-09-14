import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useReferrals = () => {
  const { user } = useAuth();
  const [referralMultiplier, setReferralMultiplier] = useState(1);

  useEffect(() => {
    if (user) {
      checkReferralBonus();
    }
  }, [user]);

  const checkReferralBonus = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('referred_by, referral_bonus_expires_at')
      .eq('user_id', user.id)
      .single();

    if (profile?.referred_by && profile.referral_bonus_expires_at) {
      const expiresAt = new Date(profile.referral_bonus_expires_at);
      const now = new Date();
      
      if (now < expiresAt) {
        setReferralMultiplier(1.5); // +50% bonus
      } else {
        setReferralMultiplier(1);
        // Remove expired bonus
        await supabase
          .from('profiles')
          .update({ referral_bonus_expires_at: null })
          .eq('user_id', user.id);
      }
    }
  };

  const updateReferralEarnings = async (earnedAmount: number) => {
    if (!user || earnedAmount <= 0) return;

    try {
      // Получаем профиль реферера
      const { data: referrerProfile } = await supabase
        .from('profiles')
        .select('user_id, referred_by')
        .eq('user_id', user.id)
        .single();

      if (referrerProfile && referrerProfile.referred_by) {
        // Добавляем 10% от заработанного к балансу реферера
        const bonusAmount = Math.floor(earnedAmount * 0.1);
        
        if (bonusAmount > 0) {
          const { data: referrer } = await supabase
            .from('profiles')
            .select('balance')
            .eq('user_id', referrerProfile.referred_by)
            .single();

          if (referrer) {
            await supabase
              .from('profiles')
              .update({ 
                balance: Math.floor(referrer.balance + bonusAmount)
              })
              .eq('user_id', referrerProfile.referred_by);
          }
        }
      }
    } catch (error) {
      console.error('Error updating referral earnings:', error);
    }
  };

  return { 
    referralMultiplier, 
    updateReferralEarnings,
    checkReferralBonus 
  };
};