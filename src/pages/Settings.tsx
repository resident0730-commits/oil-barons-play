import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Fuel, ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useGameData } from "@/hooks/useGameData";

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useGameData();
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = Math.floor(Number(amount.replace(/\D/g, "")));
    if (!value || value <= 0) {
      toast({ variant: "destructive", title: "Укажите сумму в ₽", description: "Введите положительное число" });
      return;
    }

    if (value < 100) {
      toast({ variant: "destructive", title: "Минимальная сумма", description: "Минимальная сумма пополнения 100 ₽" });
      return;
    }
    if (!supabase) {
      toast({ variant: "destructive", title: "Supabase не подключён", description: "Нажмите зелёную кнопку Supabase вверху справа и подключите проект" });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: value,
          currency: 'RUB'
        }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Переход к оплате",
          description: "Окно Stripe Checkout открыто в новой вкладке",
        });
      } else {
        throw new Error("Не удалось получить ссылку на оплату");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "Ошибка оплаты",
        description: error.message || "Не удалось создать платёж",
      });
    } finally {
      setLoading(false);
    }
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

          {/* Пополнение счета */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center"><CreditCard className="h-5 w-5 mr-2 text-primary" />Пополнение баланса</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTopUp} className="space-y-6">
                <div>
                  <Label htmlFor="amount">Сумма в рублях</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <Input
                      id="amount"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Например, 1000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                    />
                    <span className="text-sm text-muted-foreground">RUB</span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-end gap-3">
                  <Button 
                    type="submit" 
                    className="gradient-gold shadow-gold"
                    disabled={loading}
                  >
                    {loading ? "Подготовка..." : "Оплатить"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
