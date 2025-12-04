import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle, UserPlus, Users, Wallet, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FAQ = () => {
  const navigate = useNavigate();

  const faqCategories = [
    {
      title: "Регистрация",
      icon: UserPlus,
      questions: [
        {
          q: "Как зарегистрироваться в Oil Tycoon?",
          a: "Для регистрации необходимо получить реферальный код от существующего пользователя. Введите код в форму регистрации вместе с email и паролем. Без реферального кода регистрация невозможна."
        },
        {
          q: "Где получить реферальный код?",
          a: "Реферальный код можно получить от любого зарегистрированного пользователя Oil Tycoon. Попросите друга или знакомого, который уже играет, поделиться своим кодом."
        },
        {
          q: "Почему регистрация закрытая?",
          a: "Закрытая регистрация позволяет нам контролировать рост сообщества и обеспечивать качественный сервис для всех участников. Это также стимулирует реферальную программу."
        },
        {
          q: "Можно ли изменить email после регистрации?",
          a: "Для изменения email обратитесь в службу поддержки через раздел 'Поддержка' в личном кабинете."
        }
      ]
    },
    {
      title: "Реферальная система",
      icon: Users,
      questions: [
        {
          q: "Как работает реферальная система?",
          a: "Приглашая новых пользователей по своему реферальному коду, вы получаете бонусы от их пополнений: 10% с первого уровня (прямые рефералы), 5% со второго уровня и 3% с третьего уровня."
        },
        {
          q: "Где найти свой реферальный код?",
          a: "Ваш реферальный код доступен в разделе 'Рефералы' личного кабинета. Там же вы можете скопировать готовую реферальную ссылку."
        },
        {
          q: "Когда начисляются реферальные бонусы?",
          a: "Бонусы начисляются автоматически, когда ваши рефералы пополняют свой игровой счёт. Комиссия рассчитывается от суммы пополнения."
        },
        {
          q: "Есть ли ограничения на количество рефералов?",
          a: "Нет, вы можете приглашать неограниченное количество пользователей и получать бонусы от всех уровней реферальной цепочки."
        },
        {
          q: "Что получает приглашённый пользователь?",
          a: "Новые пользователи, зарегистрированные по реферальному коду, получают бонус +50% к доходу от скважин в течение первых 7 дней."
        }
      ]
    },
    {
      title: "Вывод средств",
      icon: Wallet,
      questions: [
        {
          q: "Как вывести заработанные средства?",
          a: "Для вывода средств перейдите в раздел 'Баланс' и нажмите кнопку 'Вывод'. Укажите сумму и реквизиты для получения. Заявка будет обработана в течение 24-72 часов."
        },
        {
          q: "Какие условия для вывода средств?",
          a: "Вывод доступен только для пользователей, которые совершили хотя бы одну покупку игровой валюты. Это условие необходимо для подтверждения активности аккаунта и предотвращения мошенничества."
        },
        {
          q: "Какая минимальная сумма вывода?",
          a: "Минимальная сумма вывода составляет 500 рублей. Комиссия на вывод отсутствует."
        },
        {
          q: "Сколько времени занимает вывод?",
          a: "Стандартный срок обработки заявки — от 24 до 72 часов в рабочие дни. В праздничные дни срок может быть увеличен."
        },
        {
          q: "Нужно ли платить налоги с дохода?",
          a: "Да, все доходы, полученные через платформу (включая реферальные бонусы), подлежат налогообложению. Пользователь самостоятельно рассчитывает и уплачивает налоги в соответствии с законодательством своей страны."
        }
      ]
    },
    {
      title: "Безопасность",
      icon: Shield,
      questions: [
        {
          q: "Как защитить свой аккаунт?",
          a: "Используйте сложный уникальный пароль, не передавайте данные для входа третьим лицам и не переходите по подозрительным ссылкам."
        },
        {
          q: "Что делать, если забыл пароль?",
          a: "На странице входа нажмите 'Забыли пароль?' и следуйте инструкциям для восстановления доступа через email."
        },
        {
          q: "Как связаться с поддержкой?",
          a: "Перейдите в раздел 'Поддержка' в личном кабинете и создайте тикет с описанием вашего вопроса. Мы ответим в кратчайшие сроки."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">Частые вопросы</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Ответы на популярные вопросы о работе сервиса Oil Tycoon
          </p>
        </div>

        <div className="space-y-6">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <category.icon className="w-6 h-6 text-primary" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`${categoryIndex}-${index}`}
                      className="border-border/30"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <h3 className="font-semibold mb-2">Не нашли ответ на свой вопрос?</h3>
            <p className="text-muted-foreground mb-4">
              Обратитесь в службу поддержки, и мы поможем вам
            </p>
            <Button onClick={() => navigate("/support")}>
              Написать в поддержку
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;
