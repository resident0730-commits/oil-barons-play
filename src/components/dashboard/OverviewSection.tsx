import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Fuel, 
  TrendingUp, 
  Wallet, 
  Trophy,
  Zap,
  Target,
  Users
} from "lucide-react";
import { UserProfile, UserWell } from "@/hooks/useGameData";
import { StatusDisplay } from "@/components/StatusDisplay";
import { DailyBonus } from "@/components/DailyBonus";

interface OverviewSectionProps {
  profile: UserProfile;
  wells: UserWell[];
  playerRank: number;
}

export const OverviewSection = ({ profile, wells, playerRank }: OverviewSectionProps) => {
  const totalWellsValue = wells.reduce((total, well) => {
    // Assuming base price for calculation, you might want to pass wellTypes here
    return total + 1000; // Simplified calculation
  }, 0);

  const averageDailyPerWell = wells.length > 0 ? Math.round(profile.daily_income / wells.length) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold heading-contrast">Обзор империи</h2>
          <p className="text-muted-foreground subtitle-contrast">Ваши достижения и статистика</p>
        </div>
        <div className="section-toolbar">
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Рейтинг:</span>
            <Badge className="gradient-gold text-primary-foreground">#{playerRank}</Badge>
          </div>
        </div>
      </div>

      {/* Status Display */}
      <StatusDisplay />

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Баланс</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Oil Coins</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ежедневный доход</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{profile.daily_income.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">OC в день</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Нефтяные скважины</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wells.length}</div>
            <p className="text-xs text-muted-foreground">Активных скважин</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Рейтинг</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">#{playerRank}</div>
            <p className="text-xs text-muted-foreground">В топ-списке</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Производительность</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Средний доход на скважину:</span>
              <span className="font-medium">{averageDailyPerWell.toLocaleString()} OC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Общая стоимость активов:</span>
              <span className="font-medium">{totalWellsValue.toLocaleString()} OC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">ROI в месяц:</span>
              <span className="font-medium text-primary">
                {totalWellsValue > 0 ? `${Math.round((profile.daily_income * 30 / totalWellsValue) * 100)}%` : '0%'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Активность</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DailyBonus />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Социальные достижения</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">Скоро</div>
              <p className="text-xs text-muted-foreground">Реферальная статистика</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};