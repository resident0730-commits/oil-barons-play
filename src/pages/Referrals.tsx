import { ReferralSystem } from "@/components/ReferralSystem";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useGameData } from "@/hooks/useGameData";
import { Logo } from "@/components/Logo";
import { useCurrency } from "@/hooks/useCurrency";
import {
  Fuel,
  User,
  Wallet,
  Users,
  MessageSquare,
  Shield,
  Settings,
  LogOut,
  ArrowLeft,
  TrendingUp
} from "lucide-react";

export default function Referrals() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { profile } = useGameData();
  const { formatBarrels, formatOilCoins, formatRubles } = useCurrency();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Fuel className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-luxury-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gradient-to-b from-background/95 to-background/80 border-b border-primary/10 shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <nav className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {/* Mobile back button */}
              <Link to="/dashboard" className="md:hidden">
                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Logo variant="default" linkTo="/dashboard" />
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <TooltipProvider>
                {/* Balance Cards - всегда видны */}
                <div className="flex items-center gap-2">
                  {/* Barrels */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 sm:h-9 px-2 sm:px-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30 hover:border-amber-500/50 text-xs sm:text-sm"
                      >
                        <span className="text-amber-400 mr-1">🛢️</span>
                        <span className="font-bold hidden sm:inline">{formatBarrels(profile?.barrel_balance || 0)}</span>
                        <span className="font-bold sm:hidden">{(profile?.barrel_balance || 0) > 999 ? `${Math.floor((profile?.barrel_balance || 0) / 1000)}K` : (profile?.barrel_balance || 0)}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Barrels: {formatBarrels(profile?.barrel_balance || 0)}</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* OilCoins */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 sm:h-9 px-2 sm:px-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 hover:border-green-500/50 text-xs sm:text-sm"
                      >
                        <Wallet className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-400 mr-1" />
                        <span className="font-bold hidden sm:inline">{formatOilCoins(profile?.oilcoin_balance || 0)}</span>
                        <span className="font-bold sm:hidden">{(profile?.oilcoin_balance || 0) > 999 ? `${Math.floor((profile?.oilcoin_balance || 0) / 1000)}K` : (profile?.oilcoin_balance || 0)}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>OilCoins: {formatOilCoins(profile?.oilcoin_balance || 0)}</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Rubles */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 sm:h-9 px-2 sm:px-3 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30 hover:border-yellow-500/50 text-xs sm:text-sm"
                      >
                        <span className="font-bold hidden sm:inline">{formatRubles(profile?.ruble_balance || 0)}</span>
                        <span className="font-bold sm:hidden">{(profile?.ruble_balance || 0) > 999 ? `${Math.floor((profile?.ruble_balance || 0) / 1000)}K` : (profile?.ruble_balance || 0)} ₽</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Рубли: {formatRubles(profile?.ruble_balance || 0)}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* User name - скрыт на мобильных */}
                <div className="hidden lg:flex items-center space-x-2 text-sm bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20 shadow-md">
                  <div className="p-1 bg-primary/20 rounded-full">
                    <User className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground max-w-[100px] truncate">{profile?.nickname || 'Игрок'}</span>
                </div>
                
                {/* Back button - скрыт на мобильных */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/dashboard" className="hidden md:block">
                      <Button size="sm" variant="ghost" className="backdrop-blur-sm border border-primary/20 hover:bg-primary/10 text-xs sm:text-sm">
                        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                        В кабинет
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Вернуться в личный кабинет</p>
                  </TooltipContent>
                </Tooltip>

                {isAdmin && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/admin" className="hidden sm:block">
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 text-primary hover-scale">
                          <Shield className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Админ панель</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Title Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-playfair mb-6 leading-tight bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%),_-2px_-2px_4px_rgb(0_0_0_/_70%)]">
            Реферальная система
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground [text-shadow:_2px_2px_4px_rgb(0_0_0_/_70%)]">
            Приглашайте друзей и зарабатывайте вместе
          </p>
        </div>
        
        {/* Referral System Component */}
        <div className="animate-fade-in animation-delay-100">
          <ReferralSystem />
        </div>
      </div>
    </div>
  );
}