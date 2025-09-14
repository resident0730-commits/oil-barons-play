import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Fuel, 
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

interface DashboardHeaderProps {
  profile: UserProfile;
  isAdmin: boolean;
  onTopUpClick: () => void;
  onSignOut: () => void;
}

export const DashboardHeader = ({ profile, isAdmin, onTopUpClick, onSignOut }: DashboardHeaderProps) => {
  return (
    <header className="relative border-b border-primary/20 backdrop-blur-md bg-gradient-to-r from-card/95 via-card/90 to-card/95 shadow-luxury">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5"></div>
      <div className="container mx-auto px-6 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="group flex items-center space-x-3 hover-scale">
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
              onClick={onTopUpClick}
              aria-label="Пополнить баланс"
              className="group relative overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 hover:border-primary/50 hover:shadow-primary/25 hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Wallet className="h-5 w-5 text-primary mr-2 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-bold text-lg relative z-10">{profile.balance.toLocaleString()} OC</span>
              <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
            </TooltipProvider>
          </div>
        </div>
      </div>
    </header>
  );
};