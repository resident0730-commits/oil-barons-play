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
      // Используем новую функцию для обновления реферальных начислений
      await supabase.rpc('update_referral_bonus', {
        referrer_user_id: user.id,
        earned_amount: earnedAmount
      });
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