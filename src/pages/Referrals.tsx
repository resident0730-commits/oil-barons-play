import { ReferralSystem } from "@/components/ReferralSystem";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useGameData } from "@/hooks/useGameData";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Droplet } from "lucide-react";

export default function Referrals() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { profile } = useGameData();
  const navigate = useNavigate();

  const handleTopUp = () => {
    navigate('/dashboard?section=overview');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Droplet className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dashboard-light-bg">
      <DashboardHeader 
        profile={profile} 
        isAdmin={isAdmin} 
        onTopUpClick={handleTopUp}
        onSignOut={handleSignOut}
      />

      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Title Section */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-yellow-300 drop-shadow-[0_0_25px_rgba(251,191,36,0.9)] [text-shadow:_3px_3px_8px_rgb(0_0_0_/_100%)]">
            Реферальная система
          </h1>
          <p className="text-lg sm:text-xl text-purple-100 leading-relaxed drop-shadow-[0_0_10px_rgba(168,85,247,0.6)] [text-shadow:_2px_2px_6px_rgb(0_0_0_/_100%)]">
            Приглашайте друзей и зарабатывайте вместе
          </p>
        </div>
        
        {/* Referral System Component */}
        <div className="animate-fade-in animation-delay-100">
          <ReferralSystem />
        </div>
      </main>
    </div>
  );
}