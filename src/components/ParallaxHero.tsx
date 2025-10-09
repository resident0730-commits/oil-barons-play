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

      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 hero-luxury-background" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-32">
        <div className="text-center space-y-16 animate-fade-in">
          {/* Main Title with Holographic Effect */}
          <div className="space-y-10">
            <h1 className="luxury-gold-text text-7xl md:text-9xl lg:text-[12rem] font-bold font-playfair leading-tight tracking-tight">
              OIL TYCOON
            </h1>
            
            <div className="max-w-5xl mx-auto space-y-8">
              <p className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%),_-2px_-2px_4px_rgb(0_0_0_/_70%)]">
                От первой капли нефти до нефтяной империи
              </p>
              
              <p className="text-2xl md:text-3xl font-semibold max-w-3xl mx-auto leading-relaxed bg-gradient-to-r from-yellow-100 via-white to-yellow-100 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(234,179,8,0.4)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                Реальный заработок через игровую механику! Управляйте скважинами, развивайте бизнес и выводите заработанные средства.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-12">
            {user ? (
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="gradient-primary shadow-2xl text-2xl px-14 py-8 hover-scale animate-glow-pulse group relative overflow-hidden border-2 border-primary/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Zap className="mr-3 h-7 w-7 relative z-10" />
                  <span className="relative z-10 font-bold">Продолжить империю</span>
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="gradient-primary shadow-2xl text-2xl px-14 py-8 hover-scale animate-glow-pulse group relative overflow-hidden border-2 border-primary/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Zap className="mr-3 h-7 w-7 relative z-10" />
                  <span className="relative z-10 font-bold">Начать зарабатывать</span>
                </Button>
              </Link>
            )}
            
            <Link to="/guide">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-2xl px-12 py-8 backdrop-blur-md bg-white/5 border-2 border-white/20 hover:bg-white/10 hover-scale text-white"
              >
                <BarChart3 className="mr-3 h-7 w-7" />
                <span className="font-bold">Узнать больше</span>
              </Button>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="pt-20 animate-bounce">
            <div className="w-8 h-12 border-2 border-white/40 rounded-full mx-auto flex items-start justify-center p-2">
              <div className="w-2 h-4 bg-white/80 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
