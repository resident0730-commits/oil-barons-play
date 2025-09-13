import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Fuel, ArrowLeft, CreditCard, Copy, Building2, Home, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Requisites = () => {
  const { toast } = useToast();

  const companyInfo = {
    name: "Oil Tycoon",
    inn: "891151084170",
    ogrnip: "323890100010935",
    email: "support@oiltycoon.ru",
    address: "г. Москва, ул. Тверская, д. 15, офис 301",
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
            <div className="flex items-center space-x-4">
              <Link to="/settings" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Настройки
              </Link>
              <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
                <Home className="h-4 w-4 mr-2" />
                Главная
              </Link>
            </div>
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
            <h1 className="text-3xl font-bold">Информация</h1>
            <p className="text-muted-foreground">
              Данные компании
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-primary" />
                Реквизиты компании
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RequisiteRow label="Наименование" value={companyInfo.name} />
              <RequisiteRow label="ИНН" value={companyInfo.inn} />
              <RequisiteRow label="ОГРНИП" value={companyInfo.ogrnip} />
              <RequisiteRow label="Email для связи" value={companyInfo.email} />
              <RequisiteRow label="Адрес" value={companyInfo.address} />
            </CardContent>
          </Card>

          <div className="text-center space-y-2">
            <div className="flex justify-center space-x-3">
              <Link to="/settings">
                <Button variant="outline">
                  Вернуться к настройкам
                </Button>
              </Link>
              <Link to="/">
                <Button>
                  На главную
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Requisites;