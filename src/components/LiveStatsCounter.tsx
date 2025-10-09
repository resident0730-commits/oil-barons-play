import { useEffect, useState } from 'react';
import { Users, Fuel } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

export const LiveStatsCounter = () => {
  const [onlineUsers, setOnlineUsers] = useState(0);

  // Simulate online users counter
  useEffect(() => {
    const updateOnline = () => {
      const base = 127;
      const variation = Math.floor(Math.random() * 30);
      setOnlineUsers(base + variation);
    };

    updateOnline();
    const interval = setInterval(updateOnline, 5000);
    return () => clearInterval(interval);
  }, []);

  // Demo values - можно заменить на реальные данные из API
  const totalOilToday = 1250000;
  const totalPlayers = 10234;

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
      {/* Online Players */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-green-500/10 to-green-500/5 backdrop-blur-md rounded-2xl px-6 py-3 border border-green-500/20 shadow-lg animate-fade-in">
        <div className="relative">
          <Users className="h-6 w-6 text-green-500" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <div>
          <div className="text-xs text-green-300 uppercase tracking-wider">Онлайн сейчас</div>
          <div className="text-2xl font-bold text-green-500">
            <AnimatedCounter end={onlineUsers} duration={1000} />
          </div>
        </div>
      </div>

      {/* Total Players */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-md rounded-2xl px-6 py-3 border border-primary/20 shadow-lg animate-fade-in animation-delay-100">
        <Users className="h-6 w-6 text-primary" />
        <div>
          <div className="text-xs text-primary/70 uppercase tracking-wider">Всего магнатов</div>
          <div className="text-2xl font-bold text-primary">
            <AnimatedCounter end={totalPlayers} duration={2000} />
          </div>
        </div>
      </div>

      {/* Oil Extracted Today */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-accent/10 to-accent/5 backdrop-blur-md rounded-2xl px-6 py-3 border border-accent/20 shadow-lg animate-fade-in animation-delay-200">
        <Fuel className="h-6 w-6 text-accent" />
        <div>
          <div className="text-xs text-accent/70 uppercase tracking-wider">Добыто сегодня</div>
          <div className="text-2xl font-bold text-accent">
            <AnimatedCounter end={totalOilToday} duration={2500} suffix=" баррелей" />
          </div>
        </div>
      </div>
    </div>
  );
};
