import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Fuel, 
  TrendingUp, 
  Users, 
  Award, 
  Coins, 
  BarChart3,
  Zap,
  Target
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Fuel className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Oil Tycoon</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Войти</Button>
            <Button className="gradient-gold shadow-gold">Начать игру</Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 mb-16">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            🛢️ Wealth from the Ground
          </Badge>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent">
              Oil Tycoon
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Постройте нефтяную империю, инвестируйте в скважины и получайте пассивный доход. 
              Станьте магнатом нефтяной индустрии!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-gold shadow-gold text-lg px-8 py-4">
              <Zap className="mr-2 h-5 w-5" />
              Начать с 1000₽
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              <BarChart3 className="mr-2 h-5 w-5" />
              Узнать больше
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Fuel className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle>Нефтяные скважины</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Покупайте и улучшайте скважины для максимального дохода
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle>Пассивный доход</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Получайте стабильную прибыль каждый день от ваших инвестиций
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle>Реферальная программа</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Приглашайте друзей и получайте до 10% от их инвестиций
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Award className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle>Достижения</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Соревнуйтесь с другими игроками за звание лучшего магната
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Статистика игры</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">1,247</div>
              <div className="text-muted-foreground">Активных игроков</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">₽2,847,392</div>
              <div className="text-muted-foreground">Общий доход</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">1,057</div>
              <div className="text-muted-foreground">Скважин в игре</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">₽15,842</div>
              <div className="text-muted-foreground">Средний доход</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Готовы начать?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Присоединяйтесь к тысячам успешных инвесторов. Начните с минимальной суммы 
                и постройте свою нефтяную империю уже сегодня!
              </p>
              <Separator />
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Coins className="h-4 w-4 mr-1" />
                  Минимум 1000₽
                </div>
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  Ежедневный доход
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  Бонусы за активность
                </div>
              </div>
              <Button size="lg" className="gradient-gold shadow-gold w-full text-lg">
                Зарегистрироваться и начать
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-border">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2024 Oil Tycoon. Инвестиционная игра для развлечения.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;