import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { hasSupabase } from "@/lib/supabase";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Fuel className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  // Show Supabase connection warning if not connected
  if (!hasSupabase) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-center">
              <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
              Требуется подключение к базе данных
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Fuel className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Oil Tycoon</h1>
            </div>
            <p className="text-muted-foreground">
              Для работы игры необходимо подключить Supabase для сохранения прогресса и аутентификации.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Что делать:</strong></p>
              <ol className="list-decimal list-inside space-y-1 text-left">
                <li>Нажмите зелёную кнопку "Supabase" в правом верхнем углу</li>
                <li>Создайте новый проект или подключите существующий</li>
                <li>Вернитесь сюда после подключения</li>
              </ol>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full gradient-gold shadow-gold"
            >
              Проверить подключение
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Fuel className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Oil Tycoon</h1>
          </div>
          <p className="text-muted-foreground">
            Добывайте нефть, развивайте бизнес, становитесь магнатом!
          </p>
        </div>

        {/* Form */}
        {isLogin ? (
          <LoginForm onSuccess={() => navigate('/dashboard')} />
        ) : (
          <RegisterForm onSuccess={() => setIsLogin(true)} />
        )}

        {/* Toggle */}
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;