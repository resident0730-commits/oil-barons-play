import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Fuel, ArrowLeft, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Offer = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              На главную
            </Link>
            <div className="flex items-center space-x-2">
              <Fuel className="h-6 w-6 text-primary" />
              <span className="font-semibold">Oil Tycoon</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Публичная оферта</h1>
            <p className="text-muted-foreground">
              Договор оказания услуг игрового сервиса Oil Tycoon
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCheck className="h-5 w-5 mr-2 text-primary" />
                Договор оказания услуг
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">1. Общие положения</h3>
                <p className="text-muted-foreground mb-4">
                  Настоящая публичная оферта является официальным предложением администрации 
                  игрового сервиса "Oil Tycoon" об оказании услуг по предоставлению доступа 
                  к игровому контенту и функционалу.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">2. Предмет договора</h3>
                <p className="text-muted-foreground mb-2">
                  Администрация обязуется предоставить Пользователю:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Доступ к игровому интерфейсу и функционалу</li>
                  <li>Возможность участия в игровом процессе</li>
                  <li>Техническую поддержку пользователей</li>
                  <li>Обеспечение сохранности игрового прогресса</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">3. Виртуальная валюта</h3>
                <p className="text-muted-foreground mb-4">
                  Игровая валюта "oilcoins" является виртуальной единицей, используемой 
                  исключительно в рамках игрового процесса. Виртуальная валюта не имеет 
                  реальной денежной стоимости и не подлежит обмену на реальные деньги или 
                  материальные ценности.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">4. Стоимость услуг</h3>
                <p className="text-muted-foreground mb-4">
                  Базовый доступ к игровому сервису предоставляется бесплатно. 
                  Дополнительные игровые возможности (покупка скважин, бустеров, пакетов) 
                  осуществляются за внутриигровую валюту, которая может быть получена в 
                  процессе игры или через систему ежедневных бонусов.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">5. Права и обязанности сторон</h3>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">5.1. Администрация имеет право:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Изменять игровой баланс и механики</li>
                    <li>Проводить технические работы и обновления</li>
                    <li>Блокировать аккаунты при нарушении правил</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">5.2. Пользователь обязуется:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Соблюдать правила игры</li>
                    <li>Не использовать программы-читы или эксплойты</li>
                    <li>Не передавать доступ к аккаунту третьим лицам</li>
                  </ul>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">6. Ответственность</h3>
                <p className="text-muted-foreground mb-4">
                  Администрация не несет ответственности за временную недоступность сервиса, 
                  потерю игрового прогресса вследствие технических сбоев, а также за любые 
                  косвенные убытки пользователей. Максимальная ответственность ограничивается 
                  восстановлением доступа к сервису.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">7. Возврат средств</h3>
                <p className="text-muted-foreground mb-4">
                  Все платежи за покупку игровой валюты являются окончательными и 
                  не подлежат возврату. Администрация не осуществляет возврат денежных 
                  средств за приобретенную виртуальную валюту ни при каких обстоятельствах, 
                  включая, но не ограничиваясь: изменением игровых правил, техническими 
                  сбоями, потерей доступа к аккаунту по вине пользователя или прекращением 
                  работы сервиса.
                </p>
                <p className="text-muted-foreground mb-4">
                  Приобретая игровую валюту, пользователь подтверждает, что понимает 
                  виртуальный характер покупки и согласен с условиями безвозвратности 
                  потраченных средств.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">8. Заключительные положения</h3>
                <p className="text-muted-foreground mb-4">
                  Договор вступает в силу с момента начала использования сервиса пользователем. 
                  Администрация оставляет за собой право изменять условия оферты с 
                  уведомлением пользователей через игровой интерфейс.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">9. Контактная информация</h3>
                <p className="text-muted-foreground mb-4">
                  По всем вопросам, связанным с исполнением настоящего договора, 
                  пользователи могут обращаться через систему поддержки в игровом интерфейсе 
                  или на страницу поддержки сервиса.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link to="/">
              <Button variant="outline">
                Вернуться на главную
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export { Offer };