import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useStatusBonuses = () => {
  const { user } = useAuth();
  const [statusMultiplier, setStatusMultiplier] = useState(1);
  const [userTitles, setUserTitles] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserTitles();
    }
  }, [user]);

  const fetchUserTitles = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('status_titles')
      .eq('user_id', user.id)
      .single();

    if (profile?.status_titles) {
      setUserTitles(profile.status_titles);
      calculateStatusMultiplier(profile.status_titles);
    }
  };

  const calculateStatusMultiplier = (titles: string[]) => {
    let multiplier = 1.0;

    // Oil King: +5% income
    if (titles.includes('oil_king')) {
      multiplier += 0.05;
    }

    // Leader: +3% income
    if (titles.includes('leader')) {
      multiplier += 0.03;
    }

    // Other titles: +2% income each
    if (titles.includes('industrialist')) {
      multiplier += 0.02;
    }

    setStatusMultiplier(multiplier);
  };

  const hasAmbassadorStatus = () => {
    return userTitles.includes('ambassador');
  };

  const getStatusDisplayNames = () => {
    return userTitles.map(title => {
      switch (title) {
        case 'oil_king':
          return 'Нефтяной король';
        case 'leader':
          return 'Лидер';
        case 'ambassador':
          return 'Амбассадор';
        case 'industrialist':
          return 'Промышленник';
        default:
          return title;
      }
    });
  };

  return {
    statusMultiplier,
    userTitles,
    hasAmbassadorStatus,
    getStatusDisplayNames,
    fetchUserTitles
  };
};
