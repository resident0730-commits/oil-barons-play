import { useStatusBonuses } from "@/hooks/useStatusBonuses";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Trophy, Users, Factory } from "lucide-react";

export const StatusDisplay = () => {
  const { userTitles, getStatusDisplayNames, statusMultiplier } = useStatusBonuses();

  if (userTitles.length === 0) {
    return null;
  }

  const getStatusIcon = (title: string) => {
    switch (title) {
      case 'oil_king':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'leader':
        return <Trophy className="h-4 w-4 text-purple-500" />;
      case 'ambassador':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'industrialist':
        return <Factory className="h-4 w-4 text-green-500" />;
      default:
        return <Badge className="h-4 w-4" />;
    }
  };

  const getStatusBonus = (title: string) => {
    switch (title) {
      case 'oil_king':
        return '+5% доход от скважин';
      case 'leader':
        return '+3% доход от скважин';
      case 'ambassador':
        return '+10% реферальный бонус';
      case 'industrialist':
        return '+2% доход от скважин';
      default:
        return '+2% доход';
    }
  };

  const displayNames = getStatusDisplayNames();
  const totalBonus = Math.round((statusMultiplier - 1) * 100);

  return (
    <Card className="border-gold/30 bg-gradient-to-r from-yellow-50/50 to-amber-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Crown className="h-4 w-4 text-yellow-600" />
          Активные статусы
          {totalBonus > 0 && (
            <Badge variant="secondary" className="text-xs">
              +{totalBonus}% доход
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {userTitles.map((title, index) => (
          <div key={title} className="flex items-center justify-between p-2 bg-card/50 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2">
              {getStatusIcon(title)}
              <span className="font-medium text-sm">{displayNames[index]}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {getStatusBonus(title)}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};