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
              <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black font-playfair leading-none tracking-tight
                bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent
                drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]
                [text-shadow:_2px_2px_4px_rgba(0,0,0,0.7),_-1px_-1px_2px_rgba(0,0,0,0.3)]
                [-webkit-text-stroke:1.5px_rgba(120,53,15,0.4)]
                transition-all duration-700 hover:scale-105"
              >
                OIL TYCOON
              </h1>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight
                text-white
                drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]
                [text-shadow:_1px_1px_3px_rgba(0,0,0,0.8),_-1px_-1px_2px_rgba(0,0,0,0.4)]
                [-webkit-text-stroke:0.5px_rgba(0,0,0,0.2)]
                tracking-wide"
              >
                От первой капли нефти<br />до нефтяной империи
              </h2>
              
              <p className="text-lg md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto leading-relaxed
                text-slate-100
                drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]
                [text-shadow:_1px_1px_2px_rgba(0,0,0,0.7)]
                [-webkit-text-stroke:0.3px_rgba(0,0,0,0.15)]"
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
