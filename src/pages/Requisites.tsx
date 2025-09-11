import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Fuel, ArrowLeft, CreditCard, Copy, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const Requisites = () => {
  const { toast } = useToast();

  const ipDetails = {
    beneficiary: "ИП Иванов Иван Иванович",
    inn: "770812345678",
    ogrnip: "315774600012345",
    account: "40802810401000012345",
    bank: "ПАО Сбербанк",
    bik: "044525225",
    corAccount: "30101810400000000225",
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Скопировано",
        description: `${label} скопирован в буфер обмена`,
      });
    });
  };

  const RequisiteRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-mono text-sm">{value}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => copyToClipboard(value, label)}
        className="hover:bg-background"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/settings" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к настройкам
            </Link>
            <div className="flex items-center space-x-2">
              <Fuel className="h-6 w-6 text-primary" />
              <span className="font-semibold">Oil Tycoon</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Банковские реквизиты</h1>
            <p className="text-muted-foreground">
              Для пополнения баланса через банковский перевод
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-primary" />
                Реквизиты для перевода
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RequisiteRow label="Получатель" value={ipDetails.beneficiary} />
              <RequisiteRow label="ИНН" value={ipDetails.inn} />
              <RequisiteRow label="ОГРНИП" value={ipDetails.ogrnip} />
              <RequisiteRow label="Расчётный счёт" value={ipDetails.account} />
              <RequisiteRow label="Банк получателя" value={ipDetails.bank} />
              <RequisiteRow label="БИК" value={ipDetails.bik} />
              <RequisiteRow label="Корр. счёт" value={ipDetails.corAccount} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-primary" />
                Важная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p><strong>Назначение платежа:</strong> обязательно укажите "Пополнение баланса Oil Tycoon" и ваш email, зарегистрированный в игре.</p>
                <p><strong>Минимальная сумма:</strong> 100 рублей</p>
                <p><strong>Время зачисления:</strong> 1-3 рабочих дня после поступления средств на счёт</p>
                <p><strong>Комиссия банка:</strong> согласно тарифам вашего банка</p>
              </div>
              
              <Separator />
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-amber-800 dark:text-amber-200">
                  <strong>Обратите внимание:</strong> После совершения перевода обязательно сообщите нам о платеже через поддержку с указанием суммы и даты перевода для ускорения зачисления средств.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link to="/settings">
              <Button variant="outline">
                Вернуться к настройкам
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Requisites;