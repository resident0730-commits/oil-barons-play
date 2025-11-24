import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Zap, BarChart3 } from 'lucide-react';
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
              Почувствуйте вес первого заработанного миллиона,<br />пока ваша нефтяная империя растёт
            </h2>
            
            <p className="text-lg md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto leading-relaxed text-white"
              style={{
                textShadow: '0.5px 0.5px 0 #000, -0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0 0 10px rgba(0,0,0,0.3)'
              }}
            >
              Представьте, как цифры на вашем балансе увеличиваются каждую минуту.<br />
              Ощутите реальную прибыль через увлекательную игровую механику — управляйте скважинами, наблюдайте за ростом бизнеса и выводите заработанные средства, когда захотите.
            </p>
          </div>

          {/* CTA Buttons - Window Card Style */}
          <div className="max-w-4xl mx-auto px-4 pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
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
                            Продолжить строить империю
                          </span>
                        </div>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ваши скважины уже ждут вашего возвращения</p>
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
                            Почувствовать первую прибыль
                          </span>
                        </div>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Зарегистрируйтесь сейчас и почувствуйте, как начинается ваш путь к финансовой свободе</p>
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
                          Узнать секреты успеха
                        </span>
                      </div>
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Откройте для себя проверенные стратегии роста и увидьте результаты быстрее</p>
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
