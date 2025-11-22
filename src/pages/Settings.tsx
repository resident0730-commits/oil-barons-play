import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fuel, ArrowLeft, ShieldCheck, Calendar, TrendingUp, Award, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useGameData } from "@/hooks/useGameData";
import { format, differenceInDays } from "date-fns";
import { ru } from "date-fns/locale";
import { AvatarUpload } from "@/components/AvatarUpload";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { profile, reload } = useGameData();
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url);

  useEffect(() => {
    setAvatarUrl(profile?.avatar_url);
  }, [profile?.avatar_url]);

  const handleAvatarUpdate = (url: string) => {
    setAvatarUrl(url);
    reload(); // Reload profile data
  };

  // Вычисляем дату регистрации и количество дней в игре
  const registrationDate = profile?.created_at ? new Date(profile.created_at) : null;
  const daysInGame = registrationDate ? differenceInDays(new Date(), registrationDate) : 0;
  const formattedDate = registrationDate ? format(registrationDate, "d MMMM yyyy", { locale: ru }) : "—";

  // Определяем достижения за дни в игре
  const achievements = [
    { 
      days: 7, 
      title: "Новичок", 
      description: "Играй 7 дней подряд",
      icon: "🌱",
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-500/20 to-emerald-500/10",
      achieved: daysInGame >= 7
    },
    { 
      days: 30, 
      title: "Ветеран", 
      description: "Играй 30 дней",
      icon: "⭐",
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-500/20 to-cyan-500/10",
      achieved: daysInGame >= 30
    },
    { 
      days: 100, 
      title: "Легенда", 
      description: "Играй 100 дней",
      icon: "👑",
      color: "from-yellow-500 to-orange-600",
      bgColor: "from-yellow-500/20 to-orange-500/10",
      achieved: daysInGame >= 100
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground touch-target">
              <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-base">Назад в игру</span>
            </Link>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Fuel className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="font-semibold text-sm sm:text-base">Oil Tycoon</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Avatar Upload Section */}
          <Card className="lg:col-span-1">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-center text-base sm:text-lg">Аватар профиля</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center p-4 sm:p-6 pt-0">
              <AvatarUpload 
                currentAvatarUrl={avatarUrl} 
                onAvatarUpdate={handleAvatarUpdate}
              />
            </CardContent>
          </Card>

          {/* Профиль / Безопасность */}
          <Card className="lg:col-span-2">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
                Профиль и безопасность
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <p className="text-xs sm:text-sm text-muted-foreground">Управляйте настройками аккаунта и безопасностью.</p>
              {profile && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">Никнейм:</span>
                      <span className="font-medium">{profile.nickname}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium truncate ml-2">{user?.email}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <span className="text-muted-foreground flex items-center gap-1 sm:gap-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        Регистрация:
                      </span>
                      <span className="font-medium text-primary">{formattedDate}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-accent/5 rounded-lg border border-accent/20">
                      <span className="text-muted-foreground flex items-center gap-1 sm:gap-2">
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                        Дней в игре:
                      </span>
                      <span className="font-bold text-accent">{daysInGame} {daysInGame === 1 ? 'день' : daysInGame < 5 ? 'дня' : 'дней'}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="pt-2">
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="h-10 sm:h-11 touch-target">
                    Управление профилем
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Достижения за дни в игре */}
          {profile && (
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Достижения за активность
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {achievements.map((achievement, index) => {
                    const progress = Math.min((daysInGame / achievement.days) * 100, 100);
                    
                    return (
                      <div
                        key={index}
                        className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                          achievement.achieved
                            ? `bg-gradient-to-br ${achievement.bgColor} border-transparent shadow-lg hover:scale-105`
                            : 'bg-muted/30 border-muted/50 grayscale opacity-70 hover:opacity-80'
                        }`}
                      >
                        {/* Progress bar */}
                        {!achievement.achieved && (
                          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-muted/50">
                            <div 
                              className={`h-full bg-gradient-to-r ${achievement.color} transition-all duration-500`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        )}
                        
                        {achievement.achieved && (
                          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${achievement.color}`}></div>
                        )}
                        
                        <div className="p-5 sm:p-6 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="text-4xl sm:text-5xl">{achievement.icon}</div>
                            {achievement.achieved ? (
                              <Badge className={`bg-gradient-to-r ${achievement.color} text-white border-0 shadow-md text-xs sm:text-sm`}>
                                <Award className="h-3 w-3 mr-1" />
                                Получено
                              </Badge>
                            ) : (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Lock className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className={`font-bold text-base sm:text-lg ${achievement.achieved ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {achievement.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {achievement.description}
                            </p>
                          </div>
                          
                          {!achievement.achieved && (
                            <div className="pt-2 space-y-2">
                              <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="text-muted-foreground">Прогресс:</span>
                                <span className="font-bold text-foreground">
                                  {daysInGame} / {achievement.days} дней
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Осталось: {achievement.days - daysInGame} {achievement.days - daysInGame === 1 ? 'день' : achievement.days - daysInGame < 5 ? 'дня' : 'дней'}
                              </div>
                            </div>
                          )}
                          
                          {achievement.achieved && (
                            <div className={`text-xs font-medium bg-gradient-to-r ${achievement.color} bg-clip-text text-transparent`}>
                              ✨ Достижение разблокировано!
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Show admin panel link if user is admin */}
        {isAdmin && (
          <div className="mt-8">
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <span className="font-medium">Вы администратор</span>
                  </div>
                  <Link to="/admin">
                    <Button variant="default" size="sm">
                      Админ-панель
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Settings;
