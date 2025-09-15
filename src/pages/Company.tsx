import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Fuel, ArrowLeft, Copy, Building2, Home, Mail, MapPin, User, FileText, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Company = () => {
  const { toast } = useToast();

  const companyInfo = {
    owner: "ИП Захаров А.И.",
    projectName: "Oil Tycoon",
    inn: "891151084170",
    ogrnip: "323890100010935",
    email: "oiltycoon.help@gmail.com",
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

  const RequisiteRow = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-muted">
      <div className="flex items-center space-x-3">
        {icon && <div className="text-primary">{icon}</div>}
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-medium text-foreground">{value}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => copyToClipboard(value, label)}
        className="hover:bg-background shrink-0"
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
              <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
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
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              О компании
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Информация о разработчике и владельце образовательного проекта Oil Tycoon
            </p>
          </div>

          {/* Company Information */}
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <User className="h-6 w-6 mr-3 text-primary" />
                Реквизиты компании
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RequisiteRow 
                label="Владелец проекта" 
                value={companyInfo.owner} 
                icon={<User className="h-5 w-5" />}
              />
              <RequisiteRow 
                label="Название проекта" 
                value={companyInfo.projectName} 
                icon={<Globe className="h-5 w-5" />}
              />
              <RequisiteRow 
                label="ИНН" 
                value={companyInfo.inn} 
                icon={<FileText className="h-5 w-5" />}
              />
              <RequisiteRow 
                label="ОГРНИП" 
                value={companyInfo.ogrnip} 
                icon={<FileText className="h-5 w-5" />}
              />
              <RequisiteRow 
                label="Email для связи" 
                value={companyInfo.email} 
                icon={<Mail className="h-5 w-5" />}
              />
              <RequisiteRow 
                label="Адрес" 
                value={companyInfo.address} 
                icon={<MapPin className="h-5 w-5" />}
              />
            </CardContent>
          </Card>

          {/* About Project */}
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Globe className="h-5 w-5 mr-3 text-accent" />
                О проекте Oil Tycoon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <strong>Oil Tycoon</strong> — это образовательный экономический симулятор, созданный для изучения основ бизнеса, 
                инвестирования и управления ресурсами. Проект направлен на развитие финансовой грамотности и 
                предпринимательского мышления в безопасной игровой среде.
              </p>
              
              <Separator />
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">Цели проекта:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Обучение основам экономики и бизнеса</li>
                    <li>• Развитие стратегического мышления</li>
                    <li>• Изучение принципов инвестирования</li>
                    <li>• Практика управления ресурсами</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-accent">Особенности:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Безопасная игровая среда</li>
                    <li>• Образовательный контент</li>
                    <li>• Развитие финансовой грамотности</li>
                    <li>• Интерактивное обучение</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-semibold mb-4">Связаться с нами</h3>
              <p className="text-muted-foreground mb-4">
                По всем вопросам, связанным с проектом Oil Tycoon, обращайтесь:
              </p>
              <div className="flex items-center justify-center space-x-2 text-primary font-medium">
                <Mail className="h-4 w-4" />
                <span>{companyInfo.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(companyInfo.email, "Email")}
                  className="p-1 h-auto"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/">
                <Button size="lg" className="gradient-gold shadow-gold">
                  <Home className="h-4 w-4 mr-2" />
                  На главную
                </Button>
              </Link>
              <Link to="/rules">
                <Button size="lg" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Правила игры
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Company;