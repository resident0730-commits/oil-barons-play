import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Shield, TrendingUp, Users, Gift } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Автоматически переключаемся на регистрацию, если есть реферальный код
  useEffect(() => {
    if (referralCode && !user) {
      setIsLogin(false);
    }
  }, [referralCode, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
            <h1 className="text-4xl font-bold heading-contrast">Oil Tycoon</h1>
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
          <div className="lg:hidden text-center space-y-3 mb-6">
            <h1 className="text-3xl font-bold heading-contrast">Oil Tycoon</h1>
            <p className="subtitle-contrast text-sm">
              Добывайте нефть, развивайте бизнес, становитесь магнатом!
            </p>
          </div>

          {/* Form */}
          {isLogin ? (
            <LoginForm onSuccess={() => navigate('/dashboard')} />
          ) : (
            <RegisterForm onSuccess={() => setIsLogin(true)} referralCode={referralCode || undefined} />
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
          <div className="lg:hidden space-y-3 mt-8">
            <h3 className="text-center text-sm font-semibold heading-contrast mb-4">
              Почему выбирают Oil Tycoon?
            </h3>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-background/10 backdrop-blur-sm border border-primary/20"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                      <benefit.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold heading-contrast">
                      {benefit.title}
                    </p>
                    <p className="text-xs subtitle-contrast">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;