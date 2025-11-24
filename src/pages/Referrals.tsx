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
          <div className="inline-block px-6 py-4 rounded-2xl bg-card/40 backdrop-blur-sm border border-primary/20 shadow-luxury mb-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-playfair mb-2 leading-tight bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(251,191,36,1)] [text-shadow:_4px_4px_8px_rgb(0_0_0_/_100%),_-3px_-3px_6px_rgb(0_0_0_/_90%),_0_0_20px_rgb(251_191_36_/_80%)]">
              Реферальная система
            </h1>
            <p className="text-lg sm:text-xl font-medium bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent [text-shadow:_3px_3px_6px_rgb(0_0_0_/_100%),_0_0_10px_rgb(0_0_0_/_80%)]">
              Приглашайте друзей и зарабатывайте вместе
            </p>
          </div>
        </div>
        
        {/* Referral System Component */}
        <div className="animate-fade-in animation-delay-100">
          <ReferralSystem />
        </div>
      </main>
    </div>
  );
}