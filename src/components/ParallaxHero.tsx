import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Zap, BarChart3 } from 'lucide-react';
import { OilParticles } from './OilParticles';
import { useAuth } from '@/hooks/useAuth';

export const ParallaxHero = () => {
  const { user } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate mouse position as percentage (-1 to 1)
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Oil Particles */}
      <OilParticles />

      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 hero-luxury-background"
          style={{
            transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px) scale(1.1)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-32">
        <div className="text-center space-y-16 animate-fade-in">
          {/* Main Title with Holographic Effect */}
          <div 
            className="space-y-10"
            style={{
              transform: `translate(${mousePosition.x * -8}px, ${mousePosition.y * -8}px)`
            }}
          >
            <h1 className="luxury-gold-text text-7xl md:text-9xl lg:text-[12rem] font-bold font-playfair leading-tight tracking-tight">
              OIL TYCOON
            </h1>
            
            <div className="max-w-5xl mx-auto space-y-8">
              <p className="text-3xl md:text-5xl text-white font-bold leading-tight drop-shadow-2xl">
                От первой капли нефти до нефтяной империи
              </p>
              
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                Реальный заработок через игровую механику! Управляйте скважинами, развивайте бизнес и выводите заработанные средства.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-12"
            style={{
              transform: `translate(${mousePosition.x * -12}px, ${mousePosition.y * -12}px)`
            }}
          >
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
