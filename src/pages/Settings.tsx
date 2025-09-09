import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Fuel, ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Settings = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("");

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = Math.floor(Number(amount.replace(/\D/g, "")));
    if (!value || value <= 0) {
      toast({ variant: "destructive", title: "Укажите сумму в ₽", description: "Введите положительное число" });
      return;
    }

    // Шаг 1: после добавления Stripe Secret Key создадим Edge Function и откроем Checkout в новой вкладке
    toast({
      title: "Подготовка оплаты",
      description: "После добавления Stripe ключа откроется окно оплаты в новой вкладке",
    });

    // TODO: заменить на вызов supabase.functions.invoke('create-payment', { body: { amount: value, currency: 'RUB' } })
    // Пример:
    // const { data, error } = await supabase.functions.invoke('create-payment', { body: { amount: value, currency: 'RUB' } });
    // if (error) { toast({ variant: 'destructive', title: 'Ошибка оплаты', description: error.message }); return; }
    // window.open(data.url, '_blank');
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
              <p>Управляйте настройками аккаунта и безопасностью. (Скоро)</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Изменение пароля</li>
                <li>Двухфакторная аутентификация</li>
                <li>Управление сессиями</li>
              </ul>
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
                  <Button type="submit" className="gradient-gold shadow-gold">Оплатить</Button>
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
