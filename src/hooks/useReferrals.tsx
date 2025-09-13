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

    // Find who referred this user
    const { data: profile } = await supabase
      .from('profiles')
      .select('referred_by')
      .eq('user_id', user.id)
      .single();

    if (profile?.referred_by) {
      const referralBonus = earnedAmount * 0.1; // 10% for referrer
      
      // Update referrer's balance
      const { data: referrerProfile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('user_id', profile.referred_by)
        .single();

      if (referrerProfile) {
        await supabase
          .from('profiles')
          .update({ 
            balance: referrerProfile.balance + referralBonus 
          })
          .eq('user_id', profile.referred_by);

        // Update referral earnings record
        const { data: referralRecord } = await supabase
          .from('referrals')
          .select('bonus_earned')
          .eq('referrer_id', profile.referred_by)
          .eq('referred_id', user.id)
          .single();

        if (referralRecord) {
          await supabase
            .from('referrals')
            .update({ 
              bonus_earned: referralRecord.bonus_earned + referralBonus
            })
            .eq('referrer_id', profile.referred_by)
            .eq('referred_id', user.id);
        }
      }
    }
  };

  return { 
    referralMultiplier, 
    updateReferralEarnings,
    checkReferralBonus 
  };
};