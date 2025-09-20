import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel, ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useGameData } from "@/hooks/useGameData";

const Settings = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { profile } = useGameData();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад в игру
            </Link>
            <div className="flex items-center space-x-2">
              <Fuel className="h-6 w-6 text-primary" />
              <span className="font-semibold">Oil Tycoon</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Профиль / Безопасность */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center"><ShieldCheck className="h-5 w-5 mr-2 text-primary" />Профиль и безопасность</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Управляйте настройками аккаунта и безопасностью.</p>
              {profile && (
                <div className="space-y-2">
                  <p><strong>Никнейм:</strong> {profile.nickname}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Суммарный доход в день:</strong> ₽{profile.daily_income.toLocaleString()}</p>
                </div>
              )}
              <div className="pt-2">
                <Link to="/profile">
                  <Button variant="outline" size="sm">
                    Управление профилем
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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
