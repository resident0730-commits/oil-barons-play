import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Zap, BarChart3 } from 'lucide-react';
import { OilParticles } from './OilParticles';
import { useAuth } from '@/hooks/useAuth';

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
          <div className="space-y-8">
            <div className="relative inline-block animate-fade-in">
              {/* Золотое свечение */}
              <div className="absolute -inset-6 bg-gradient-to-r from-yellow-500/20 via-amber-400/30 to-yellow-500/20 blur-3xl animate-pulse" />
              
              <h1 className="relative text-7xl md:text-9xl lg:text-[11rem] font-black font-playfair leading-none tracking-tight
                text-transparent bg-clip-text
                bg-gradient-to-b from-[#D4AF37] via-[#F4C542] to-[#C9A961]
                drop-shadow-[0_0_50px_rgba(212,175,55,0.7)]
                [text-shadow:_3px_3px_0_#B8960C,_6px_6px_0_#9A7D0A,_9px_9px_0_#7D6608,_12px_12px_0_#5F4E06,_15px_15px_0_#4A3A05,_18px_18px_30px_rgba(0,0,0,0.6),_0_0_60px_rgba(212,175,55,0.5)]
                transition-all duration-300 hover:scale-105
                filter brightness-125 contrast-110 saturate-130"
                style={{
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
          </div>

          {/* CTA Buttons - Clean & Modern */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {user ? (
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="group text-xl px-12 py-7 font-bold
                    bg-gradient-to-r from-amber-500 to-yellow-600
                    hover:from-amber-400 hover:to-yellow-500
                    text-white
                    shadow-[0_8px_30px_rgba(251,191,36,0.4)]
                    hover:shadow-[0_12px_40px_rgba(251,191,36,0.6)]
                    border-0
                    transition-all duration-300 hover:scale-105 hover:-translate-y-1
                    rounded-xl
                    relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                    -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <Zap className="mr-2 h-6 w-6 relative z-10" />
                  <span className="relative z-10">Продолжить империю</span>
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="group text-xl px-12 py-7 font-bold
                    bg-gradient-to-r from-amber-500 to-yellow-600
                    hover:from-amber-400 hover:to-yellow-500
                    text-white
                    shadow-[0_8px_30px_rgba(251,191,36,0.4)]
                    hover:shadow-[0_12px_40px_rgba(251,191,36,0.6)]
                    border-0
                    transition-all duration-300 hover:scale-105 hover:-translate-y-1
                    rounded-xl
                    relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                    -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <Zap className="mr-2 h-6 w-6 relative z-10" />
                  <span className="relative z-10">Начать зарабатывать</span>
                </Button>
              </Link>
            )}
            
            <Link to="/guide">
              <Button 
                size="lg" 
                variant="outline" 
                className="group text-xl px-10 py-7 font-semibold
                  backdrop-blur-md bg-white/10 
                  hover:bg-white/20
                  border-2 border-white/30 hover:border-white/50
                  text-white
                  shadow-[0_4px_20px_rgba(255,255,255,0.1)]
                  hover:shadow-[0_6px_30px_rgba(255,255,255,0.2)]
                  transition-all duration-300 hover:scale-105 hover:-translate-y-1
                  rounded-xl
                  relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                  -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <BarChart3 className="mr-2 h-6 w-6 relative z-10" />
                <span className="relative z-10">Узнать больше</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
