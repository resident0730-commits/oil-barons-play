import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Fuel, ArrowLeft, CreditCard, ShieldCheck, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useGameData } from "@/hooks/useGameData";

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { profile } = useGameData();
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("yookassa");

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
      // Choose function based on payment method
      const functionName = paymentMethod === 'tbank' ? 'create-tbank-payment' : 'create-payment';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
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
          description: `Окно ${paymentMethod === 'tbank' ? 'Т-Банк' : 'YooKassa'} открыто в новой вкладке`,
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
              <div className="space-y-6">
                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Способ оплаты</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4">
                    <Label htmlFor="yookassa-settings" className="flex items-center space-x-3 cursor-pointer border rounded-lg p-3 hover:bg-accent transition-colors">
                      <RadioGroupItem value="yookassa" id="yookassa-settings" />
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="text-sm font-medium">YooKassa</span>
                      </div>
                    </Label>
                    <Label htmlFor="tbank-settings" className="flex items-center space-x-3 cursor-pointer border rounded-lg p-3 hover:bg-accent transition-colors">
                      <RadioGroupItem value="tbank" id="tbank-settings" />
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Т-Банк</span>
                      </div>
                    </Label>
                  </RadioGroup>
                </div>
                
                <Separator />
                
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
                <div className="flex items-center justify-between">
                  <Link to="/requisites">
                    <Button variant="outline">
                      Информация
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    className="gradient-gold shadow-gold"
                    disabled={loading}
                  >
                    {loading ? "Подготовка..." : "Оплатить"}
                  </Button>
                </div>
              </form>
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
