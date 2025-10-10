import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel, Zap, Shield, TrendingUp, Users, Gift } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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


  const benefits = [
    {
      icon: Zap,
      title: "Быстрый старт",
      description: "Начните зарабатывать с первой минуты"
    },
    {
      icon: TrendingUp,
      title: "Рост дохода",
      description: "Увеличивайте прибыль каждый день"
    },
    {
      icon: Shield,
      title: "Безопасность",
      description: "Защита данных и транзакций"
    },
    {
      icon: Users,
      title: "Реферальная система",
      description: "Приглашайте друзей и получайте бонусы"
    },
    {
      icon: Gift,
      title: "Ежедневные награды",
      description: "Бонусы за активность каждый день"
    }
  ];

  return (
    <div className="min-h-screen hero-luxury-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Benefits */}
        <div className="hidden lg:block space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Fuel className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold heading-contrast">Oil Tycoon</h1>
            </div>
            <p className="text-xl subtitle-contrast">
              Добывайте нефть, развивайте бизнес, становитесь магнатом!
            </p>
          </div>

          <div className="space-y-4 mt-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-start space-x-4 p-4 rounded-lg bg-background/10 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg heading-contrast mb-1">
                    {benefit.title}
                  </h3>
                  <p className="subtitle-contrast text-sm">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Mobile Header */}
          <div className="lg:hidden text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Fuel className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold heading-contrast">Oil Tycoon</h1>
            </div>
            <p className="subtitle-contrast">
              Добывайте нефть, развивайте бизнес!
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
              className="text-foreground hover:text-primary"
            >
              {isLogin ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
            </Button>
          </div>

          {/* Mobile Benefits Preview */}
          <div className="lg:hidden grid grid-cols-2 gap-3 mt-6">
            {benefits.slice(0, 4).map((benefit, index) => (
              <div 
                key={index}
                className="p-3 rounded-lg bg-background/10 backdrop-blur-sm border border-primary/20 text-center"
              >
                <benefit.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium heading-contrast">
                  {benefit.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;