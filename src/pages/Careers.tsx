import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Users,
  Clock,
  MapPin,
  DollarSign,
  Shield,
  Headphones,
  Globe,
  Briefcase,
  Star,
  Target,
  TrendingUp,
  Mail,
  X
} from "lucide-react";
import { Link } from "react-router-dom";

const Careers = () => {
  const [showEmailMessage, setShowEmailMessage] = useState(false);

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
      icon: <Users className="h-8 w-8 text-primary" />,
      description: "Руководство командой игроков, развитие региональных направлений и достижение целевых показателей проекта.",
      responsibilities: [
        "Управление группой из 50-100 активных игроков",
        "Мотивация команды для достижения игровых целей",
        "Анализ показателей эффективности и разработка стратегий роста",
        "Проведение обучающих вебинаров и мастер-классов",
        "Координация с центральным офисом по вопросам развития",
        "Подготовка отчетов о деятельности региона"
      ],
      requirements: [
        "Опыт управления командой от 2 лет",
        "Понимание игровой экономики и механик",
        "Отличные коммуникативные навыки",
        "Опыт работы с CRM-системами",
        "Аналитическое мышление"
      ],
      motivation: "Процент от результатов команды + бонусы за достижение KPI + корпоративные льготы"
    },
    {
      id: 2,
      title: "Системный администратор",
      department: "IT",
      salary: "120 000 ₽",
      type: "Полная занятость",
      location: "Офис",
      schedule: "5/2",
      icon: <Shield className="h-8 w-8 text-primary" />,
      description: "Обеспечение стабильной работы игровой платформы, администрирование серверов и решение технических задач.",
      responsibilities: [
        "Мониторинг работоспособности игровых серверов 24/7",
        "Настройка и поддержка серверной инфраструктуры",
        "Резервное копирование и восстановление данных",
        "Настройка систем безопасности и мониторинга",
        "Оптимизация производительности базы данных",
        "Техническая поддержка разработчиков"
      ],
      requirements: [
        "Опыт администрирования Linux/Windows серверов",
        "Знание SQL и работа с базами данных",
        "Опыт работы с Docker и системами виртуализации",
        "Понимание сетевых протоколов и настройки firewall",
        "Навыки скриптинга (Bash, Python)"
      ],
      benefits: [
        "Официальное трудоустройство",
        "Корпоративное обучение",
        "Медицинская страховка",
        "Гибкий график внутри рабочего дня"
      ]
    },
    {
      id: 3,
      title: "Оператор службы поддержки",
      department: "Поддержка",
      salary: "90 000 ₽",
      type: "Полная занятость",
      location: "Удаленно",
      schedule: "Посменно (включая ночные смены)",
      icon: <Headphones className="h-8 w-8 text-primary" />,
      description: "Консультирование игроков, решение технических вопросов и обеспечение высокого уровня клиентского сервиса.",
      responsibilities: [
        "Консультирование игроков по всем вопросам игры",
        "Решение технических проблем и багов",
        "Обработка заявок на пополнение и вывод средств",
        "Модерация игрового чата и форума",
        "Ведение базы знаний и FAQ",
        "Эскалация сложных вопросов на второй уровень поддержки"
      ],
      requirements: [
        "Опыт работы в службе поддержки от 1 года",
        "Отличные письменные и устные коммуникативные навыки",
        "Стрессоустойчивость и клиентоориентированность",
        "Знание принципов работы игровых платформ",
        "Готовность работать в ночные смены"
      ],
      benefits: [
        "Полностью удаленная работа",
        "Гибкий график смен",
        "Доплаты за ночные смены",
        "Корпоративное обучение продукту",
        "Карьерный рост внутри компании"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-slate-300 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад на главную
            </Link>
            <div className="flex items-center space-x-2">
              <Briefcase className="h-6 w-6 text-amber-400" />
              <span className="font-semibold text-white">Карьера в Oil Tycoon</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Email Message */}
        {showEmailMessage && (
          <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg px-4 animate-fade-in">
            <Card className="border-2 border-amber-400 shadow-2xl bg-gradient-to-r from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg animate-pulse">
                      <Mail className="h-6 w-6 text-slate-900" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-amber-400 mb-2 flex items-center">
                        📧 Отправка резюме
                        <span className="ml-2 text-xs bg-amber-400/20 text-amber-300 px-2 py-1 rounded-full">
                          Важно
                        </span>
                      </h3>
                      <p className="text-white mb-3">
                        Для трудоустройства отправляйте резюме на:
                      </p>
                      <div className="p-3 bg-slate-700/50 rounded-lg border border-amber-400/20">
                        <p className="font-bold text-amber-400 text-lg">
                          oiltycoon.help@gmail.com
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={hideEmailMessage}
                    className="text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-all"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="mt-4 pt-4 border-t border-amber-400/20">
                  <p className="text-sm text-slate-300 text-center">
                    💼 Укажите в теме письма название желаемой позиции
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center space-y-6">
          <Badge variant="secondary" className="text-base px-6 py-3 bg-amber-400/20 text-amber-300 border-amber-400/30">
            <Star className="h-5 w-5 mr-2" />
            Присоединяйтесь к команде
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Вакансии Oil Tycoon
          </h1>
          
          <p className="text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Мы ищем талантливых специалистов для развития нашей игровой платформы. 
            Присоединяйтесь к команде профессионалов и помогайте создавать лучший игровой опыт.
          </p>
        </div>

        {/* Company Values */}
        <Card className="max-w-4xl mx-auto border-amber-400/30 shadow-2xl bg-slate-800/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl flex items-center justify-center gap-2 mb-4 text-white">
              <Target className="h-7 w-7 text-amber-400" />
              Почему стоит работать с нами
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-3">
                <div className="p-4 bg-amber-400/20 rounded-full w-fit mx-auto">
                  <Globe className="h-8 w-8 text-amber-400" />
                </div>
                <h3 className="font-semibold text-white text-lg">Инновационный продукт</h3>
                <p className="text-slate-300 text-base">Работайте над передовой игровой платформой с уникальной экономической моделью</p>
              </div>
              <div className="text-center space-y-3">
                <div className="p-4 bg-orange-400/20 rounded-full w-fit mx-auto">
                  <Users className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="font-semibold text-white text-lg">Профессиональная команда</h3>
                <p className="text-slate-300 text-base">Окружите себя опытными специалистами и развивайтесь вместе с компанией</p>
              </div>
              <div className="text-center space-y-3">
                <div className="p-4 bg-amber-400/20 rounded-full w-fit mx-auto">
                  <TrendingUp className="h-8 w-8 text-amber-400" />
                </div>
                <h3 className="font-semibold text-white text-lg">Карьерный рост</h3>
                <p className="text-slate-300 text-base">Четкие перспективы развития и возможности для профессионального роста</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-white">Открытые вакансии</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              Выберите подходящую позицию и станьте частью нашей динамично развивающейся команды
            </p>
          </div>

          <div className="grid gap-8">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-2xl transition-all duration-300 border-slate-600/50 bg-slate-800/50 backdrop-blur-sm hover:border-amber-400/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-amber-400/20 rounded-lg">
                        {job.icon && React.cloneElement(job.icon as React.ReactElement, { className: "h-10 w-10 text-amber-400" })}
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-3 text-white">{job.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary" className="bg-amber-400/20 text-amber-300 border-amber-400/30 text-sm px-3 py-1">{job.department}</Badge>
                          <Badge variant="outline" className="border-slate-600 text-slate-300 text-sm px-3 py-1">{job.type}</Badge>
                        </div>
                        <p className="text-slate-300 text-lg leading-relaxed">{job.description}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Two Column Layout */}
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Responsibilities and Requirements */}
                    <div className="space-y-6">
                      {/* Responsibilities */}
                      <div>
                        <h4 className="font-semibold mb-4 text-white text-lg">Обязанности:</h4>
                        <ul className="space-y-3">
                          {job.responsibilities.map((responsibility, index) => (
                            <li key={index} className="flex items-start gap-3 text-base">
                              <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">{responsibility}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Requirements */}
                      <div>
                        <h4 className="font-semibold mb-4 text-white text-lg">Требования:</h4>
                        <ul className="space-y-3">
                          {job.requirements.map((requirement, index) => (
                            <li key={index} className="flex items-start gap-3 text-base">
                              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-300">{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Benefits */}
                      {job.benefits && (
                        <div>
                          <h4 className="font-semibold mb-4 text-white text-lg">Что мы предлагаем:</h4>
                          <ul className="space-y-3">
                            {job.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-3 text-base">
                                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-slate-300">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Job Info */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                        <DollarSign className="h-6 w-6 text-amber-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-white text-lg mb-1">Зарплата</p>
                          <p className="text-slate-300 text-lg font-semibold">{job.salary}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                        <MapPin className="h-6 w-6 text-amber-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-white text-lg mb-1">Локация</p>
                          <p className="text-slate-300 text-lg">{job.location}</p>
                        </div>
                      </div>

                      {job.schedule && (
                        <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                          <Clock className="h-6 w-6 text-amber-400 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium text-white text-lg mb-1">График</p>
                            <p className="text-slate-300 text-lg">{job.schedule}</p>
                          </div>
                        </div>
                      )}

                      {job.motivation && (
                        <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                          <Star className="h-6 w-6 text-amber-400 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="font-medium text-white text-lg mb-2">Мотивация</p>
                            <p className="text-slate-300 text-base leading-relaxed">{job.motivation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="pt-4 border-t border-slate-600/50">
                    <Button className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-semibold px-6 py-3 text-lg" onClick={handleJobApplication}>
                      <Mail className="h-5 w-5 mr-2" />
                      Отправить резюме
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-slate-600/50 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl text-white">Не нашли подходящую вакансию?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-300 text-lg">
                Отправьте нам свое резюме, и мы свяжемся с вами при появлении подходящих позиций. 
                Мы всегда рады талантливым специалистам!
              </p>
              <Button size="lg" className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-semibold w-full text-xl py-4" onClick={handleJobApplication}>
                <Mail className="h-5 w-5 mr-2" />
                Связаться с HR
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Careers;