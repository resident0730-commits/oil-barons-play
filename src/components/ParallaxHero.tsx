import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, BarChart3, Users, Gift, ArrowRight } from 'lucide-react';
import { OilParticles } from './OilParticles';
import { useAuth } from '@/hooks/useAuth';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ParallaxHero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleReferralClick = () => {
    navigate(user ? '/referrals' : '/auth');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Oil Particles */}
      <OilParticles />

      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 hero-luxury-background" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-32">
        <div className="text-center space-y-12">
          {/* Main Title - Clean & Elegant */}
          {/* Роскошная золотая надпись с градиентом */}
          <div style={{ 
            filter: 'drop-shadow(3px 3px 0 #B8860B) drop-shadow(5px 5px 0 #8B6914) drop-shadow(8px 8px 15px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 30px rgba(255, 215, 0, 0.7))'
          }}>
            <h1 
              className="font-black leading-none tracking-tight animate-fade-in mb-8"
              style={{
                fontSize: 'clamp(4rem, 15vw, 11rem)',
                background: 'linear-gradient(180deg, #FFEB3B 0%, #FFD700 15%, #FFC107 30%, #FFB300 45%, #FFA000 60%, #D4AF37 75%, #C19A3F 90%, #8B6914 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              OIL TYCOON
            </h1>
          </div>
            
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-white"
              style={{
                textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 0 15px rgba(0,0,0,0.4)'
              }}
            >
              От первой капли нефти<br />до нефтяной империи
            </h2>
            
            <p className="text-lg md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto leading-relaxed text-white"
              style={{
                textShadow: '0.5px 0.5px 0 #000, -0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0 0 10px rgba(0,0,0,0.3)'
              }}
            >
              Реальный заработок через игровую механику!<br />
              Управляйте скважинами, развивайте бизнес и выводите заработанные средства.
            </p>
          </div>

          {/* Referral Banner */}
          <div 
            onClick={handleReferralClick}
            className="max-w-4xl mx-auto px-4 pt-8 animate-fade-in cursor-pointer" 
            style={{ animationDelay: '0.35s' }}
          >
            <div className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2">
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
              <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                {/* Left side - Icon and title */}
                <div className="flex items-center gap-4 lg:gap-5">
                  <div className="relative">
                    <div className="p-4 sm:p-5 bg-amber-500/30 rounded-2xl backdrop-blur-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Users className="h-10 w-10 sm:h-12 sm:w-12 text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <h3 className="text-2xl sm:text-3xl font-bold text-amber-100 mb-1 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
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
          </div>

          {/* CTA Buttons - Window Card Style */}
          <div className="max-w-4xl mx-auto px-4 pt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <TooltipProvider>
              {user ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/dashboard" className="block">
                      <div className="group relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-transparent backdrop-blur-xl border-2 border-amber-500/50 hover:border-amber-400 transition-all duration-500 hover:-translate-y-2 rounded-xl p-8 cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-amber-400/40 transition-all duration-500"></div>
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                        <div className="relative flex items-center justify-center gap-3">
                          <Zap className="h-7 w-7 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
                          <span className="text-xl font-bold text-amber-100 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                            Продолжить империю
                          </span>
                        </div>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Вернуться к управлению своими скважинами</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/auth" className="block">
                      <div className="group relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-transparent backdrop-blur-xl border-2 border-amber-500/50 hover:border-amber-400 transition-all duration-500 hover:-translate-y-2 rounded-xl p-8 cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-amber-400/40 transition-all duration-500"></div>
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                        <div className="relative flex items-center justify-center gap-3">
                          <Zap className="h-7 w-7 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
                          <span className="text-xl font-bold text-amber-100 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                            Начать зарабатывать
                          </span>
                        </div>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Зарегистрируйтесь и начните строить свою нефтяную империю</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/guide" className="block">
                    <div className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent backdrop-blur-xl border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-500 hover:-translate-y-2 rounded-xl p-8 cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-cyan-400/40 transition-all duration-500"></div>
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </div>
                      <div className="relative flex items-center justify-center gap-3">
                        <BarChart3 className="h-7 w-7 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                        <span className="text-xl font-bold text-cyan-100 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                          Как играть
                        </span>
                      </div>
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Подробный гайд по игровым механикам и стратегиям</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
