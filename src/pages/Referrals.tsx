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
            
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <TooltipProvider>
                <div className="hidden md:flex items-center space-x-2 text-sm bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20 shadow-md">
                  <div className="p-1 bg-primary/20 rounded-full">
                    <User className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground max-w-[100px] truncate">{profile?.nickname || 'Игрок'}</span>
                </div>
                
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
                      <Link to="/admin">
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
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-playfair mb-6 leading-tight bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%),_-2px_-2px_4px_rgb(0_0_0_/_70%)]">
            Реферальная система
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Приглашайте друзей и зарабатывайте вместе
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in animation-delay-100">
          {/* Barrels Balance */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent backdrop-blur-xl border-2 border-amber-500/50 hover:border-amber-400 transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-amber-400/40 transition-all duration-500"></div>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
            <CardContent className="relative p-8">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-amber-500/30 text-amber-300 border-amber-500/40 text-sm px-3 py-1">BBL</Badge>
                <TrendingUp className="h-6 w-6 text-amber-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Barrels</p>
              <p className="text-4xl font-bold text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]">
                {formatBarrels(profile?.barrel_balance || 0)}
              </p>
              <p className="text-xs text-amber-300/70 mt-3">Производство нефти</p>
            </CardContent>
          </Card>

          {/* OilCoins Balance */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent backdrop-blur-xl border-2 border-green-500/50 hover:border-green-400 transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-green-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-green-400/40 transition-all duration-500"></div>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
            <CardContent className="relative p-8">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-green-500/30 text-green-300 border-green-500/40 text-sm px-3 py-1">OC</Badge>
                <Wallet className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-2">OilCoins</p>
              <p className="text-4xl font-bold text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]">
                {formatOilCoins(profile?.oilcoin_balance || 0)}
              </p>
              <p className="text-xs text-green-300/70 mt-3">Игровая валюта</p>
            </CardContent>
          </Card>

          {/* Rubles Balance */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-transparent backdrop-blur-xl border-2 border-yellow-500/50 hover:border-yellow-400 transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-yellow-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-yellow-400/40 transition-all duration-500"></div>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
            <CardContent className="relative p-8">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-yellow-500/30 text-yellow-300 border-yellow-500/40 text-sm px-3 py-1">₽</Badge>
                <TrendingUp className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Рубли</p>
              <p className="text-4xl font-bold text-yellow-400 drop-shadow-[0_0_20px_rgba(234,179,8,0.6)]">
                {formatRubles(profile?.ruble_balance || 0)}
              </p>
              <p className="text-xs text-yellow-300/70 mt-3">Выводимая валюта</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Referral System Component */}
        <div className="animate-fade-in animation-delay-200">
          <ReferralSystem />
        </div>
      </div>
    </div>
  );
}