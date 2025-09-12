import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Wallet, Factory, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGameData, wellTypes } from "@/hooks/useGameData";

const Statistics = () => {
  const { user } = useAuth();
  const { profile, wells } = useGameData();

  const totalWellsValue = wells.reduce((sum, well) => {
    const wellType = wellTypes.find(wt => wt.name === well.well_type);
    return sum + (wellType ? wellType.price * well.level : 0);
  }, 0);
  const averageWellIncome = wells.length > 0 ? wells.reduce((sum, well) => sum + well.daily_income, 0) / wells.length : 0;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Войдите в систему для просмотра статистики</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к панели
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Статистика</h1>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Текущий баланс</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₽{profile?.balance?.toLocaleString() || '0'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Доходность скважин в день</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₽{profile?.daily_income?.toLocaleString() || '0'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Количество скважин</CardTitle>
              <Factory className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wells.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Стоимость скважин</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₽{totalWellsValue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Анализ прибыльности</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Средняя прибыль с скважины:</span>
                <span className="font-semibold">₽{averageWellIncome.toFixed(0)}/день</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Месячная прибыль:</span>
                <span className="font-semibold">₽{((profile?.daily_income || 0) * 30).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Годовая прибыль:</span>
                <span className="font-semibold">₽{((profile?.daily_income || 0) * 365).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ROI (годовой):</span>
                <span className="font-semibold text-green-600">
                  {totalWellsValue > 0 ? (((profile?.daily_income || 0) * 365 / totalWellsValue) * 100).toFixed(1) : '0'}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Портфель скважин</CardTitle>
            </CardHeader>
            <CardContent>
              {wells.length === 0 ? (
                <p className="text-muted-foreground">У вас пока нет скважин</p>
              ) : (
                <div className="space-y-3">
                  {wells.map((well, index) => (
                    <div key={well.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{well.well_type}</p>
                        <p className="text-sm text-muted-foreground">Уровень {well.level}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₽{well.daily_income}/день</p>
                        <p className="text-sm text-muted-foreground">₽{(wellTypes.find(wt => wt.name === well.well_type)?.price * well.level || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Statistics;