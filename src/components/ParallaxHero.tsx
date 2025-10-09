import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Zap, Coins, BarChart3, Fuel } from 'lucide-react';
import { OilParticles } from './OilParticles';
import { LiveStatsCounter } from './LiveStatsCounter';
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

      {/* Parallax Background Layers */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
        style={{
          transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`
        }}
      />
      
      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-pulse"
        style={{
          transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`
        }}
      />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-20">
        <div className="text-center space-y-12 animate-fade-in">
          {/* Badge */}
          <div 
            className="relative inline-block"
            style={{
              transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`
            }}
          >
            <Badge 
              variant="secondary" 
              className="text-lg px-6 py-3 bg-card/50 backdrop-blur-md shadow-primary animate-scale-in border-2 border-primary/30"
            >
              <Fuel className="w-5 h-5 mr-2 animate-glow-pulse" />
              Богатство из недр земли
            </Badge>
          </div>
          
          {/* Main Title with Holographic Effect */}
          <div 
            className="space-y-8"
            style={{
              transform: `translate(${mousePosition.x * -8}px, ${mousePosition.y * -8}px)`
            }}
          >
            <h1 className="holographic-text text-6xl md:text-8xl lg:text-9xl font-bold font-playfair leading-tight">
              Oil Tycoon
            </h1>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-2xl md:text-4xl text-foreground/90 font-bold leading-relaxed drop-shadow-lg">
                От первой капли нефти до нефтяной империи
              </p>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Реальный заработок через игровую механику! Управляйте скважинами, развивайте бизнес и выводите заработанные средства.
              </p>

              {/* USP Points */}
              <div 
                className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8"
                style={{
                  transform: `translate(${mousePosition.x * 12}px, ${mousePosition.y * 12}px)`
                }}
              >
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 hover-scale">
                  <div className="text-4xl mb-3">💰</div>
                  <h3 className="text-xl font-bold mb-2 text-primary">Пассивный доход 24/7</h3>
                  <p className="text-sm text-muted-foreground">Ваши скважины работают, пока вы спите</p>
                </div>
                
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 backdrop-blur-sm rounded-2xl p-6 border border-accent/20 hover-scale">
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="text-xl font-bold mb-2 text-accent">От новичка до олигарха</h3>
                  <p className="text-sm text-muted-foreground">Постройте империю за 30 дней</p>
                </div>
                
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 hover-scale">
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className="text-xl font-bold mb-2 text-primary">Реальные призы</h3>
                  <p className="text-sm text-muted-foreground">Конкурсы и розыгрыши каждую неделю</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
            style={{
              transform: `translate(${mousePosition.x * -12}px, ${mousePosition.y * -12}px)`
            }}
          >
            {user ? (
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="gradient-primary shadow-primary text-xl px-12 py-6 hover-scale animate-glow-pulse group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Zap className="mr-3 h-6 w-6 relative z-10" />
                  <span className="relative z-10">Продолжить империю</span>
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="gradient-primary shadow-primary text-xl px-12 py-6 hover-scale animate-glow-pulse group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Coins className="mr-3 h-6 w-6 relative z-10" />
                  <span className="relative z-10">Начать зарабатывать</span>
                </Button>
              </Link>
            )}
            
            <Link to="/guide">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-xl px-10 py-6 backdrop-blur-sm bg-card/30 border-primary/50 hover:bg-primary/10 hover-scale"
              >
                <BarChart3 className="mr-3 h-6 w-6" />
                Узнать больше
              </Button>
            </Link>
          </div>

          {/* Live Stats Counter */}
          <div 
            className="pt-12"
            style={{
              transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
            }}
          >
            <LiveStatsCounter />
          </div>

          {/* Scroll Indicator */}
          <div className="pt-16 animate-bounce">
            <div className="w-6 h-10 border-2 border-primary/30 rounded-full mx-auto flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
