import { ReferralSystem } from "@/components/ReferralSystem";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useGameData } from "@/hooks/useGameData";
import {
  Fuel,
  User,
  Wallet,
  BarChart3,
  Users,
  Award,
  Trophy,
  BookOpen,
  MessageSquare,
  Shield,
  Settings,
  LogOut,
  ArrowLeft
} from "lucide-react";

export default function Referrals() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { profile } = useGameData();

  const handleSignOut = async () => {
    await signOut();
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
    <div className="min-h-screen dashboard-light-bg">
      {/* Header with Navigation */}
      <header className="relative border-b border-primary/20 backdrop-blur-md bg-gradient-to-r from-card/95 via-card/90 to-card/95 shadow-luxury">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5"></div>
        <div className="container mx-auto px-6 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="group flex items-center space-x-3 hover-scale">
              <ArrowLeft className="h-6 w-6 text-primary mr-2" />
              <div className="relative">
                <Fuel className="h-10 w-10 text-primary drop-shadow-lg transition-transform duration-300 group-hover:rotate-12" />
                <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-playfair font-bold bg-gradient-to-r from-primary via-oil-gold to-accent bg-clip-text text-transparent">
                  Oil Tycoon
                </h1>
                <p className="text-xs text-muted-foreground font-medium tracking-wide">Нефтяная Империя</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-6">
              {/* Balance Display */}
              <Button
                variant="outline"
                size="lg"
                aria-label="Баланс"
                className="group relative overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30"
              >
                <Wallet className="h-5 w-5 text-primary mr-2" />
                <span className="font-bold text-lg">{profile.balance.toLocaleString()} OC</span>
              </Button>
              
              {/* User Info */}
              <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gradient-to-r from-secondary/30 to-accent/20 border border-primary/20">
                <div className="relative">
                  <User className="h-5 w-5 text-primary" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse"></div>
                </div>
                <span className="font-playfair font-medium text-foreground">{profile.nickname}</span>
              </div>

              {/* Navigation Icons */}
              <TooltipProvider>
                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/dashboard">
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 hover-scale">
                          <Fuel className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Главная</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/profile">
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 hover-scale">
                          <User className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Профиль</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/statistics">
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 hover-scale">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Статистика</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/referrals">
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 hover-scale bg-primary/20">
                          <Users className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Рефералы</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/achievements">
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 hover-scale">
                          <Award className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Достижения</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/leaderboard">
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 hover-scale">
                          <Trophy className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Рейтинг игроков</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/support">
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 hover-scale">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Служба поддержки</p>
                    </TooltipContent>
                  </Tooltip>

                  {isAdmin && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to="/admin">
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10 text-primary hover-scale glow-gold">
                            <Shield className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Админ панель</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/settings">
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 hover-scale">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Настройки</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleSignOut}
                        className="hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 hover-scale"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Выйти из аккаунта</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Реферальная система</h1>
          <p className="text-muted-foreground">
            Приглашайте друзей и зарабатывайте вместе
          </p>
        </div>
        
        <ReferralSystem />
      </div>
    </div>
  );
}