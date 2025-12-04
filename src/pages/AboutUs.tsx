import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { usePageVisibility } from "@/hooks/usePageVisibility";
import { useUserRole } from "@/hooks/useUserRole";
import { 
  Fuel, ArrowLeft, Copy, Building2, Home, Mail, MapPin, User, FileText, Globe,
  Users, Clock, DollarSign, Shield, Headphones, Briefcase, Star, Target, TrendingUp, X
} from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const { toast } = useToast();
  const { isCompanySectionVisible, isCompanyRequisiteVisible } = usePageVisibility();
  const { isAdmin } = useUserRole();
  const [showEmailMessage, setShowEmailMessage] = useState(false);

  const companyInfo = {
    owner: "ИП Захаров А.И.",
    projectName: "Oil Tycoon",
    inn: "881151084171",
    ogrnip: "323890100010934",
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

  const shouldShowSection = (sectionKey: string): boolean => {
    return isCompanySectionVisible(sectionKey) || isAdmin;
  };

  const shouldShowRequisite = (requisiteKey: string): boolean => {
    return isCompanyRequisiteVisible(requisiteKey) || isAdmin;
  };

  const handleJobApplication = () => {
    setShowEmailMessage(true);
  };

  const hideEmailMessage = () => {
    setShowEmailMessage(false);
  };

  const jobs = [
    {
      id: 1,
      title: "Региональный менеджер",
      department: "Управление",
      salary: "150 000 - 250 000 ₽",
      type: "Полная занятость",
      location: "Удаленно / Офис",
      icon: <Users className="h-8 w-8" />,
      description: "Руководство командой игроков, развитие региональных направлений и достижение целевых показателей проекта.",
      responsibilities: [
        "Управление группой из 50-100 активных игроков",
        "Мотивация команды для достижения игровых целей",
        "Анализ показателей эффективности и разработка стратегий роста",
        "Проведение обучающих вебинаров и мастер-классов",
      ],
      requirements: [
        "Опыт управления командой от 2 лет",
        "Понимание игровой экономики и механик",
        "Отличные коммуникативные навыки",
      ],
    },
    {
      id: 2,
      title: "Системный администратор",
      department: "IT",
      salary: "120 000 ₽",
      type: "Полная занятость",
      location: "Офис",
      icon: <Shield className="h-8 w-8" />,
      description: "Обеспечение стабильной работы игровой платформы, администрирование серверов и решение технических задач.",
      responsibilities: [
        "Мониторинг работоспособности игровых серверов 24/7",
        "Настройка и поддержка серверной инфраструктуры",
        "Резервное копирование и восстановление данных",
      ],
      requirements: [
        "Опыт администрирования Linux/Windows серверов",
        "Знание SQL и работа с базами данных",
        "Опыт работы с Docker и системами виртуализации",
      ],
    },
    {
      id: 3,
      title: "Оператор службы поддержки",
      department: "Поддержка",
      salary: "90 000 ₽",
      type: "Полная занятость",
      location: "Удаленно",
      icon: <Headphones className="h-8 w-8" />,
      description: "Консультирование игроков, решение технических вопросов и обеспечение высокого уровня клиентского сервиса.",
      responsibilities: [
        "Консультирование игроков по всем вопросам игры",
        "Решение технических проблем и багов",
        "Обработка заявок на пополнение и вывод средств",
      ],
      requirements: [
        "Опыт работы в службе поддержки от 1 года",
        "Отличные коммуникативные навыки",
        "Готовность работать в ночные смены",
      ],
    }
  ];

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
            <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Главная
            </Link>
            <div className="flex items-center space-x-2">
              <Fuel className="h-6 w-6 text-primary" />
              <span className="font-semibold">Oil Tycoon</span>
            </div>
          </div>
        </div>
      </header>

      {/* Email Message for Job Applications */}
      {showEmailMessage && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg px-4 animate-fade-in">
          <Card className="border-2 border-primary shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary rounded-full">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">📧 Отправка резюме</h3>
                    <p className="text-foreground mb-3">Для трудоустройства отправляйте резюме на:</p>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-bold text-primary text-lg">{companyInfo.email}</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={hideEmailMessage}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  💼 Укажите в теме письма название желаемой позиции
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              О нас
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Информация о проекте Oil Tycoon и возможности для карьеры
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="company" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="company" className="text-base">
                <Building2 className="h-4 w-4 mr-2" />
                О компании
              </TabsTrigger>
              <TabsTrigger value="careers" className="text-base">
                <Briefcase className="h-4 w-4 mr-2" />
                Вакансии
              </TabsTrigger>
            </TabsList>

            {/* Company Tab */}
            <TabsContent value="company" className="space-y-6">
              {/* Company Information */}
              <Card className="border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <User className="h-6 w-6 mr-3 text-primary" />
                    Реквизиты компании
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {shouldShowRequisite('owner') && (
                    <RequisiteRow label="Владелец проекта" value={companyInfo.owner} icon={<User className="h-5 w-5" />} />
                  )}
                  {shouldShowRequisite('project_name') && (
                    <RequisiteRow label="Название проекта" value={companyInfo.projectName} icon={<Globe className="h-5 w-5" />} />
                  )}
                  {shouldShowRequisite('inn') && (
                    <RequisiteRow label="ИНН" value={companyInfo.inn} icon={<FileText className="h-5 w-5" />} />
                  )}
                  {shouldShowRequisite('ogrnip') && (
                    <RequisiteRow label="ОГРНИП" value={companyInfo.ogrnip} icon={<FileText className="h-5 w-5" />} />
                  )}
                  {shouldShowRequisite('email') && (
                    <RequisiteRow label="Email для связи" value={companyInfo.email} icon={<Mail className="h-5 w-5" />} />
                  )}
                  {shouldShowRequisite('address') && (
                    <RequisiteRow label="Адрес" value={companyInfo.address} icon={<MapPin className="h-5 w-5" />} />
                  )}
                  
                  {isAdmin && (
                    <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                      <h4 className="text-sm font-semibold text-destructive mb-2">Скрытые элементы (видны только админу):</h4>
                      <div className="space-y-1 text-xs text-destructive">
                        {!isCompanyRequisiteVisible('owner') && <div>• Владелец проекта - скрыт</div>}
                        {!isCompanyRequisiteVisible('project_name') && <div>• Название проекта - скрыто</div>}
                        {!isCompanyRequisiteVisible('inn') && <div>• ИНН - скрыт</div>}
                        {!isCompanyRequisiteVisible('ogrnip') && <div>• ОГРНИП - скрыт</div>}
                        {!isCompanyRequisiteVisible('email') && <div>• Email для связи - скрыт</div>}
                        {!isCompanyRequisiteVisible('address') && <div>• Адрес - скрыт</div>}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* About Project */}
              {shouldShowSection('project_description') && (
                <Card className="border-accent/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Globe className="h-5 w-5 mr-3 text-accent" />
                      О проекте Oil Tycoon
                      {!isCompanySectionVisible('project_description') && isAdmin && (
                        <Badge variant="destructive" className="ml-2 text-xs">Скрыто</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      <strong>Oil Tycoon</strong> — это образовательный экономический симулятор, созданный для изучения основ бизнеса, 
                      инвестирования и управления ресурсами.
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
              )}

              {/* Contact */}
              {shouldShowSection('contact_info') && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-4">Связаться с нами</h3>
                    <p className="text-muted-foreground mb-4">По всем вопросам обращайтесь:</p>
                    <div className="flex items-center justify-center space-x-2 text-primary font-medium">
                      <Mail className="h-4 w-4" />
                      <span>{companyInfo.email}</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(companyInfo.email, "Email")} className="p-1 h-auto">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Careers Tab */}
            <TabsContent value="careers" className="space-y-8">
              {/* Why Work With Us */}
              <Card className="border-primary/20 shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    Почему стоит работать с нами
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center space-y-3">
                      <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                        <Globe className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold">Инновационный продукт</h3>
                      <p className="text-muted-foreground text-sm">Работайте над передовой игровой платформой</p>
                    </div>
                    <div className="text-center space-y-3">
                      <div className="p-4 bg-accent/10 rounded-full w-fit mx-auto">
                        <Users className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="font-semibold">Профессиональная команда</h3>
                      <p className="text-muted-foreground text-sm">Развивайтесь с опытными специалистами</p>
                    </div>
                    <div className="text-center space-y-3">
                      <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                        <TrendingUp className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold">Карьерный рост</h3>
                      <p className="text-muted-foreground text-sm">Четкие перспективы развития</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Listings */}
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Открытые вакансии</h2>
                  <p className="text-muted-foreground">Выберите подходящую позицию</p>
                </div>

                {jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg text-primary">
                          {job.icon}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="secondary">{job.department}</Badge>
                            <Badge variant="outline">{job.type}</Badge>
                          </div>
                          <p className="text-muted-foreground">{job.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <DollarSign className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Зарплата</p>
                            <p className="font-medium">{job.salary}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <MapPin className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Локация</p>
                            <p className="font-medium">{job.location}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Обязанности:</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {job.responsibilities.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Требования:</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {job.requirements.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Button onClick={handleJobApplication} className="w-full">
                        <Mail className="h-4 w-4 mr-2" />
                        Откликнуться на вакансию
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* CTA */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="text-center py-8">
                  <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Не нашли подходящую вакансию?</h3>
                  <p className="text-muted-foreground mb-4">
                    Отправьте резюме, и мы свяжемся с вами, когда появится подходящая позиция
                  </p>
                  <Button onClick={handleJobApplication}>
                    <Mail className="h-4 w-4 mr-2" />
                    Отправить резюме
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Navigation */}
          {shouldShowSection('navigation_buttons') && (
            <div className="text-center space-y-4 pt-8">
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/">
                  <Button size="lg" className="gradient-primary shadow-primary">
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
          )}
        </div>
      </main>
    </div>
  );
};

export default AboutUs;