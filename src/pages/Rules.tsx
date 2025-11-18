import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, Gift, Zap, Trophy, Shield, Heart, Sparkles, ArrowLeft, Home, Users, Award, Star, Fuel, TrendingUp, BarChart3, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Rules() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              На главную
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              В игру
            </Button>
          </Link>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold gradient-text">Правила игры</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Честная игра с прозрачными правилами. Развивайте свою нефтяную империю!
          </p>
        </div>

        <Card className="gradient-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Наши принципы
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Честная игра</h4>
                  <p className="text-sm text-muted-foreground">
                    Все можно получить бесплатно через игровую активность
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Gift className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Ежедневные бонусы</h4>
                  <p className="text-sm text-muted-foreground">
                    Получайте игровую валюту каждый день бесплатно
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              Трехвалютная система
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg p-4 border border-amber-500/20">
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-2">BBL</Badge>
                <h4 className="font-semibold mb-2">Barrels</h4>
                <p className="text-sm text-muted-foreground mb-3">Производственная валюта, добывается скважинами 24/7</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Добыча: 20,000-1,440,000 BBL/день</li>
                  <li>• Обмен: минимум 1,000 BBL</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mb-2">OC</Badge>
                <h4 className="font-semibold mb-2">OilCoins</h4>
                <p className="text-sm text-muted-foreground mb-3">Основная игровая валюта</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Стартовый: 1,000 OC</li>
                  <li>• Обмен BBL или покупка</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-500/20">
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-2">₽</Badge>
                <h4 className="font-semibold mb-2">Rubles</h4>
                <p className="text-sm text-muted-foreground mb-3">Премиум валюта</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Курс: 1₽ = 1 OC</li>
                  <li>• Вывод: от 500₽</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-orange-500" />
              Типы скважин
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex justify-between items-center p-3 bg-secondary/20 rounded">
                <span className="text-sm font-medium">Мини</span>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">1,000 OC</Badge>
                  <p className="text-xs text-muted-foreground">20K BBL/день</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary/20 rounded">
                <span className="text-sm font-medium">Стартовая</span>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">2,000 OC</Badge>
                  <p className="text-xs text-muted-foreground">44K BBL/день</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary/20 rounded">
                <span className="text-sm font-medium">Средняя</span>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">3,000 OC</Badge>
                  <p className="text-xs text-muted-foreground">72K BBL/день</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary/20 rounded">
                <span className="text-sm font-medium">Промышленная</span>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">5,000 OC</Badge>
                  <p className="text-xs text-muted-foreground">130K BBL/день</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary/20 rounded">
                <span className="text-sm font-medium">Супер</span>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">8,000 OC</Badge>
                  <p className="text-xs text-muted-foreground">224K BBL/день</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary/20 rounded">
                <span className="text-sm font-medium">Премиум</span>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">12,000 OC</Badge>
                  <p className="text-xs text-muted-foreground">360K BBL/день</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary/20 rounded">
                <span className="text-sm font-medium">Элитная</span>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">18,000 OC</Badge>
                  <p className="text-xs text-muted-foreground">576K BBL/день</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary/20 rounded">
                <span className="text-sm font-medium">Легендарная</span>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">27,000 OC</Badge>
                  <p className="text-xs text-muted-foreground">918K BBL/день</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded border border-purple-500/20 md:col-span-2">
                <span className="text-sm font-medium">Космическая</span>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1 border-purple-500/30">40,000 OC</Badge>
                  <p className="text-xs text-purple-400">1,440K BBL/день</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
              <h5 className="font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4" />
                Улучшения: +50% к добыче за уровень
              </h5>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4 py-8">
          <h2 className="text-2xl font-bold">Готовы начать?</h2>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/dashboard">
              <Button size="lg" className="gradient-gold">
                <Star className="h-5 w-5 mr-2" />
                Начать играть
              </Button>
            </Link>
            <Link to="/guide">
              <Button size="lg" variant="outline">
                Читать полный гайд
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}