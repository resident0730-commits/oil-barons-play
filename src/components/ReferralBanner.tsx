import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Users, Gift, ArrowRight, Sparkles } from "lucide-react";

export const ReferralBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      navigate('/referrals');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 hover:-translate-y-2 animate-fade-in"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-orange-500/20 to-yellow-500/30 backdrop-blur-xl"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600/40 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Animated glow effects */}
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-amber-500/40 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-amber-400/50 transition-all duration-500"></div>
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-500/40 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-orange-400/50 transition-all duration-500"></div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
      
      {/* Border */}
      <div className="absolute inset-0 rounded-3xl border-2 border-amber-500/50 group-hover:border-amber-400 transition-colors duration-300"></div>
      
      {/* Content */}
      <div className="relative p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
        {/* Left side - Icon and title */}
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="relative">
            <div className="p-4 sm:p-5 bg-amber-500/30 rounded-2xl backdrop-blur-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Users className="h-10 w-10 sm:h-14 sm:w-14 text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
          
          <div className="text-left">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-100 mb-1 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              Реферальная система
            </h3>
            <p className="text-amber-200/90 text-sm sm:text-base [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
              Приглашай друзей — зарабатывай вместе!
            </p>
          </div>
        </div>
        
        {/* Center - Benefits */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 flex-1">
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full border border-amber-400/40 backdrop-blur-sm">
            <Gift className="h-4 w-4 text-amber-300" />
            <span className="text-amber-100 font-bold text-sm sm:text-base [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">10% с 1 уровня</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full border border-orange-400/40 backdrop-blur-sm">
            <Gift className="h-4 w-4 text-orange-300" />
            <span className="text-orange-100 font-bold text-sm sm:text-base [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">5% с 2 уровня</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full border border-yellow-400/40 backdrop-blur-sm">
            <Gift className="h-4 w-4 text-yellow-300" />
            <span className="text-yellow-100 font-bold text-sm sm:text-base [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">3% с 3 уровня</span>
          </div>
        </div>
        
        {/* Right side - CTA */}
        <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full group-hover:from-amber-400 group-hover:to-orange-400 transition-all duration-300 shadow-lg shadow-amber-500/30 group-hover:shadow-amber-400/50">
          <span className="text-white font-bold text-sm sm:text-base whitespace-nowrap">
            {user ? 'Подробнее' : 'Начать'}
          </span>
          <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );
};
