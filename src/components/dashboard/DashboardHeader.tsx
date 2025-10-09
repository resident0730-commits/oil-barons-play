import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Wallet, 
  User,
  BarChart3,
  Users,
  Award,
  MessageSquare,
  Shield,
  Settings,
  LogOut
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
  const { formatGameCurrency } = useCurrency();
  return (
    <header className="relative border-b border-primary/20 backdrop-blur-md bg-gradient-to-r from-card/95 via-card/90 to-card/95 shadow-luxury">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5"></div>
      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-6 relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link to="/" className="group hover-scale min-w-0">
            <div className="space-y-1 min-w-0">
              <h1 className="text-xl sm:text-3xl font-playfair font-bold bg-gradient-to-r from-primary via-oil-gold to-accent bg-clip-text text-transparent truncate">
                Oil Tycoon
              </h1>
              <p className="text-xs text-muted-foreground font-medium tracking-wide hidden sm:block">Нефтяная Империя</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 flex-shrink-0">
            {/* Balance Display */}
            <Button
              variant="outline"
              size="sm"
              onClick={onTopUpClick}
              aria-label="Пополнить баланс"
              className="group relative overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 hover:border-primary/50 hover:shadow-primary/25 hover:shadow-lg transition-all duration-300 px-2 sm:px-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-1 sm:mr-2 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-bold text-sm sm:text-lg relative z-10">{formatGameCurrency(profile.balance)}</span>
              <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            
            {/* User Info - Hidden on small screens */}
            <div className="hidden sm:flex items-center space-x-3 px-4 py-2 rounded-lg bg-gradient-to-r from-secondary/30 to-accent/20 border border-primary/20">
              <div className="relative">
                <User className="h-5 w-5 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse"></div>
              </div>
              <span className="font-playfair font-medium text-foreground max-w-[100px] truncate">{profile.nickname}</span>
            </div>

            {/* Navigation Icons - Responsive */}
            <TooltipProvider>
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Mobile: Show all icons but compact */}
                <div className="flex sm:hidden space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 h-8 w-8">
                        <Link to="/referrals">
                          <Users className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Рефералы</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 h-8 w-8">
                        <Link to="/achievements">
                          <Award className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Достижения</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 h-8 w-8">
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
                        <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 h-8 w-8">
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
                      <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 h-8 w-8">
                        <Link to="/settings">
                          <Settings className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Настройки</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={onSignOut} className="hover:bg-destructive/10 h-8 w-8">
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Выйти</TooltipContent>
                  </Tooltip>
                </div>

                {/* Desktop: Show all icons */}
                <div className="hidden sm:flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                        <Link to="/referrals">
                          <Users className="h-5 w-5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Рефералы</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                        <Link to="/achievements">
                          <Award className="h-5 w-5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Достижения</TooltipContent>
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
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </header>
  );
};