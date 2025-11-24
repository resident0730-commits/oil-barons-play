import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Logo } from "@/components/Logo";
import { 
  Wallet, 
  User,
  BarChart3,
  Users,
  MessageSquare,
  Shield,
  Settings,
  LogOut,
  Droplet,
  Coins
} from "lucide-react";
import { Link } from "react-router-dom";
import { UserProfile } from "@/hooks/useGameData";
import { useCurrency } from "@/hooks/useCurrency";

interface DashboardHeaderProps {
  profile: UserProfile;
  isAdmin: boolean;
  onTopUpClick: () => void;
  onSignOut: () => void;
}

export const DashboardHeader = ({ profile, isAdmin, onTopUpClick, onSignOut }: DashboardHeaderProps) => {
  const { formatOilCoins, formatBarrels, formatRubles } = useCurrency();
  return (
    <header className="relative border-b border-primary/20 backdrop-blur-md bg-gradient-to-r from-card/95 via-card/90 to-card/95 shadow-luxury">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5"></div>
      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-6 relative z-10">
        {/* Mobile Layout */}
        <div className="sm:hidden space-y-3">
          {/* First Row: Logo and User */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <Logo variant="compact" linkTo="/" />
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-gradient-to-r from-secondary/30 to-accent/20 border border-primary/20">
              <User className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="font-playfair text-sm font-medium text-foreground max-w-[80px] truncate">{profile.nickname}</span>
            </div>
          </div>

          {/* Second Row: Balances */}
          <div className="grid grid-cols-3 gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={onTopUpClick}
              className="group relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent backdrop-blur-xl border border-primary/40 hover:border-primary transition-all px-1 h-8 justify-start min-w-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Wallet className="h-3.5 w-3.5 text-primary flex-shrink-0 relative z-10" />
              <span className="font-bold text-[10px] ml-0.5 truncate relative z-10 block overflow-hidden">{formatOilCoins(profile.oilcoin_balance)}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent backdrop-blur-xl border border-emerald-500/40 hover:border-emerald-400 transition-all px-1 h-8 cursor-default justify-start min-w-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Droplet className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 relative z-10" />
              <span className="font-bold text-[10px] ml-0.5 truncate relative z-10 block overflow-hidden">{formatBarrels(profile.barrel_balance)}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="group relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent backdrop-blur-xl border border-amber-500/40 hover:border-amber-400 transition-all px-1 h-8 cursor-default justify-start min-w-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Coins className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 relative z-10" />
              <span className="font-bold text-[10px] ml-0.5 truncate relative z-10 block overflow-hidden">{formatRubles(profile.ruble_balance)}</span>
            </Button>
          </div>

          {/* Third Row: Navigation Icons */}
          <div className="flex items-center justify-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 h-9 w-9">
                    <Link to="/dashboard">
                      <BarChart3 className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Личный кабинет</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 h-9 w-9">
                    <Link to="/support">
                      <MessageSquare className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Поддержка</TooltipContent>
              </Tooltip>

              {isAdmin && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 h-9 w-9">
                      <Link to="/admin">
                        <Shield className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Админ панель</TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 h-9 w-9">
                    <Link to="/settings">
                      <Settings className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Настройки</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onSignOut} className="hover:bg-destructive/10 h-9 w-9">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Выйти</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between flex-wrap gap-3">
          <Logo variant="default" linkTo="/" />
          
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* OilCoins Balance */}
            <Button
              variant="outline"
              size="sm"
              onClick={onTopUpClick}
              aria-label="Пополнить баланс"
              className="group relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent backdrop-blur-xl border-2 border-primary/40 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 px-2 sm:px-4 h-9 sm:h-10"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-1.5 sm:mr-2 transition-transform duration-300 group-hover:scale-110 flex-shrink-0 relative z-10" />
              <span className="font-bold text-xs sm:text-base relative z-10">{formatOilCoins(profile.oilcoin_balance)}</span>
            </Button>

            {/* Barrels Balance */}
            <Button
              variant="outline"
              size="sm"
              className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent backdrop-blur-xl border-2 border-emerald-500/40 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 px-2 sm:px-4 cursor-default h-9 sm:h-10"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/20 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Droplet className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 mr-1.5 sm:mr-2 transition-transform duration-300 group-hover:scale-110 flex-shrink-0 relative z-10" />
              <span className="font-bold text-xs sm:text-base relative z-10">{formatBarrels(profile.barrel_balance)}</span>
            </Button>

            {/* Rubles Balance */}
            <Button
              variant="outline"
              size="sm"
              className="group relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent backdrop-blur-xl border-2 border-amber-500/40 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 px-2 sm:px-4 cursor-default h-9 sm:h-10"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/20 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mr-1.5 sm:mr-2 transition-transform duration-300 group-hover:scale-110 flex-shrink-0 relative z-10" />
              <span className="font-bold text-xs sm:text-base relative z-10">{formatRubles(profile.ruble_balance)}</span>
            </Button>
          
            {/* User Info */}
            <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gradient-to-r from-secondary/30 to-accent/20 border border-primary/20">
              <div className="relative">
                <User className="h-5 w-5 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse"></div>
              </div>
              <span className="font-playfair font-medium text-foreground max-w-[100px] truncate">{profile.nickname}</span>
            </div>

            {/* Navigation Icons */}
            <TooltipProvider>
              <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                        <Link to="/dashboard">
                          <BarChart3 className="h-5 w-5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Личный кабинет</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                        <Link to="/support">
                          <MessageSquare className="h-5 w-5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Поддержка</TooltipContent>
                  </Tooltip>

                  {isAdmin && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                          <Link to="/admin">
                            <Shield className="h-5 w-5" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Админ панель</TooltipContent>
                    </Tooltip>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                        <Link to="/settings">
                          <Settings className="h-5 w-5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Настройки</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={onSignOut} className="hover:bg-destructive/10">
                        <LogOut className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Выйти</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </header>
    );
};