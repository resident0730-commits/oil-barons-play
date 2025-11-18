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
                <h3 className="font-semibold mb-2">3. Виртуальная валюта и игровые активы</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">3.1. Типы внутриигровой валюты</h4>
                    <p className="text-muted-foreground mb-2">
                      В игре используются следующие виды виртуальной валюты:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li><strong>Баррели (BBL)</strong> - производственная валюта, добываемая скважинами автоматически 24/7</li>
                      <li><strong>OilCoins (OC)</strong> - основная игровая валюта для покупки скважин и улучшений</li>
                      <li><strong>Рубли (₽)</strong> - премиум валюта с возможностью вывода</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">3.2. Правовой статус виртуальной валюты</h4>
                    <p className="text-muted-foreground mb-2">
                      Виртуальная валюта и игровые активы (скважины, бустеры) являются 
                      нематериальными объектами, используемыми исключительно в рамках игрового процесса. 
                      Виртуальная валюта не является законным платежным средством, ценной бумагой, 
                      электронными деньгами или любым другим финансовым инструментом в понимании 
                      действующего законодательства Российской Федерации.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">3.3. Ограничения на использование</h4>
                    <p className="text-muted-foreground mb-2">
                      Пользователь не может:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Передавать или продавать виртуальную валюту третьим лицам вне игровых механик</li>
                      <li>Использовать виртуальную валюту для расчетов за пределами игрового сервиса</li>
                      <li>Предъявлять претензии на получение реального эквивалента виртуальной валюты</li>
                      <li>Требовать компенсации при изменении курсов обмена или игровых механик</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">4. Стоимость услуг и порядок оплаты</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">4.1. Базовые услуги</h4>
                    <p className="text-muted-foreground mb-2">
                      Базовый доступ к игровому сервису предоставляется бесплатно и включает:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Регистрацию и создание игрового аккаунта</li>
                      <li>Доступ к игровому интерфейсу и базовым механикам</li>
                      <li>Ежедневные бонусы и бесплатные награды</li>
                      <li>Систему достижений и рейтингов</li>
                      <li>Реферальную программу</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">4.2. Дополнительные возможности</h4>
                    <p className="text-muted-foreground mb-2">
                      Покупка внутриигровых активов (скважин, бустеров, пакетов) осуществляется 
                      за внутриигровую валюту OilCoins, которая может быть получена следующими способами:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Обмен накопленных баррелей (BBL) на OilCoins через игровую биржу</li>
                      <li>Получение ежедневных бонусов и наград</li>
                      <li>Выполнение игровых достижений</li>
                      <li>Участие в реферальной программе</li>
                      <li>Приобретение за реальные денежные средства (опционально)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">4.3. Платежные операции</h4>
                    <p className="text-muted-foreground mb-2">
                      При пополнении баланса реальными денежными средствами:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Все платежи обрабатываются через сертифицированные платежные системы</li>
                      <li>Курс конвертации составляет 1₽ = 1 OilCoin</li>
                      <li>Минимальная сумма пополнения определяется платежной системой</li>
                      <li>Платежи зачисляются автоматически в течение 1-15 минут</li>
                      <li>При технических сбоях срок зачисления может быть увеличен до 24 часов</li>
                    </ul>
                  </div>
                </div>
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
                <h3 className="font-semibold mb-2">7. Возврат средств и споры</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">7.1. Общие положения о возврате</h4>
                    <p className="text-muted-foreground mb-2">
                      Все платежи за покупку игровой валюты являются окончательными и 
                      не подлежат возврату. Администрация не осуществляет возврат денежных 
                      средств за приобретенную виртуальную валюту ни при каких обстоятельствах, 
                      включая, но не ограничиваясь:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Изменением игровых правил, балансировки или механик</li>
                      <li>Техническими сбоями или временной недоступностью сервиса</li>
                      <li>Потерей доступа к аккаунту по вине пользователя</li>
                      <li>Прекращением работы сервиса</li>
                      <li>Блокировкой аккаунта за нарушение правил</li>
                      <li>Личным разочарованием от игрового процесса</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">7.2. Подтверждение понимания</h4>
                    <p className="text-muted-foreground mb-2">
                      Приобретая игровую валюту, пользователь подтверждает, что:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Понимает виртуальный и развлекательный характер покупки</li>
                      <li>Согласен с условиями безвозвратности потраченных средств</li>
                      <li>Ознакомлен с игровыми механиками и правилами</li>
                      <li>Действует добровольно и по собственному желанию</li>
                      <li>Не имеет претензий к функционалу и качеству сервиса</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">7.3. Исключительные случаи</h4>
                    <p className="text-muted-foreground mb-2">
                      Возврат средств возможен только в следующих случаях:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Двойное списание средств при технической ошибке платежной системы</li>
                      <li>Несанкционированное использование банковской карты (при предоставлении официального подтверждения от банка)</li>
                      <li>Незачисление средств на игровой счет в течение 72 часов при подтверждении платежа</li>
                    </ul>
                    <p className="text-muted-foreground mt-2">
                      Для инициации возврата в исключительных случаях необходимо обратиться в 
                      службу поддержки с предоставлением документов, подтверждающих основания для возврата.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">7.4. Разрешение споров</h4>
                    <p className="text-muted-foreground">
                      Все споры и разногласия, возникающие между сторонами, решаются путем 
                      переговоров. При невозможности достижения согласия споры подлежат 
                      рассмотрению в соответствии с действующим законодательством Российской Федерации.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">8. Вывод средств</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">8.1. Условия вывода</h4>
                    <p className="text-muted-foreground mb-2">
                      Пользователи могут выводить рублевый баланс при соблюдении следующих условий:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Минимальная сумма вывода составляет 500 рублей</li>
                      <li>Аккаунт должен быть верифицирован и не иметь ограничений</li>
                      <li>Указаны корректные реквизиты для перевода средств</li>
                      <li>Отсутствуют подозрения в нарушении правил или мошенничестве</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">8.2. Сроки обработки</h4>
                    <p className="text-muted-foreground">
                      Заявки на вывод средств обрабатываются в течение 1-3 рабочих дней. 
                      Администрация оставляет за собой право увеличить срок проверки до 7 дней 
                      при необходимости дополнительной верификации. Фактическое зачисление средств 
                      зависит от работы платежных систем и банков.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">8.3. Отказ в выводе</h4>
                    <p className="text-muted-foreground mb-2">
                      Администрация вправе отказать в выводе средств в случаях:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Нарушения правил игры или пользовательского соглашения</li>
                      <li>Использования читов, ботов или эксплойтов</li>
                      <li>Попытки обмана или мошенничества</li>
                      <li>Предоставления недостоверных данных</li>
                      <li>Использования нескольких аккаунтов одним лицом</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">9. Интеллектуальная собственность</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">9.1. Права на контент</h4>
                    <p className="text-muted-foreground">
                      Все элементы игрового сервиса, включая, но не ограничиваясь: дизайн интерфейса, 
                      графические элементы, тексты, программный код, игровые механики, торговые марки 
                      и логотипы - являются объектами исключительных прав Администрации или 
                      используются на законных основаниях.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">9.2. Ограничения использования</h4>
                    <p className="text-muted-foreground mb-2">
                      Пользователю запрещается:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Копировать, воспроизводить или распространять элементы игры</li>
                      <li>Декомпилировать, дизассемблировать программный код</li>
                      <li>Создавать производные работы на основе игрового контента</li>
                      <li>Использовать торговые марки без письменного разрешения</li>
                      <li>Извлекать игровые ресурсы для использования вне сервиса</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">10. Конфиденциальность и защита данных</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">10.1. Сбор информации</h4>
                    <p className="text-muted-foreground mb-2">
                      При использовании сервиса собираются следующие данные:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Данные аккаунта (никнейм, email, пароль в зашифрованном виде)</li>
                      <li>Игровая статистика (баланс, скважины, достижения)</li>
                      <li>Технические данные (IP-адрес, тип устройства, браузер)</li>
                      <li>История платежей и транзакций</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">10.2. Использование данных</h4>
                    <p className="text-muted-foreground mb-2">
                      Собранные данные используются для:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Обеспечения функционирования игрового процесса</li>
                      <li>Предотвращения мошенничества и нарушений</li>
                      <li>Улучшения качества сервиса</li>
                      <li>Обработки платежей и выплат</li>
                      <li>Коммуникации с пользователями</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">10.3. Защита информации</h4>
                    <p className="text-muted-foreground">
                      Администрация применяет современные технические и организационные меры 
                      для защиты персональных данных от несанкционированного доступа, изменения, 
                      раскрытия или уничтожения. Однако абсолютная безопасность не может быть 
                      гарантирована при передаче данных через интернет.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">11. Заключительные положения</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">11.1. Вступление в силу</h4>
                    <p className="text-muted-foreground">
                      Договор вступает в силу с момента начала использования сервиса пользователем 
                      и действует бессрочно до момента прекращения использования сервиса или 
                      удаления аккаунта.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">11.2. Изменение условий</h4>
                    <p className="text-muted-foreground">
                      Администрация оставляет за собой право изменять условия оферты в одностороннем 
                      порядке. Пользователи уведомляются об изменениях через игровой интерфейс, 
                      системные сообщения или email. Существенные изменения публикуются не менее чем 
                      за 7 дней до вступления в силу.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">11.3. Форс-мажор</h4>
                    <p className="text-muted-foreground">
                      Стороны освобождаются от ответственности за частичное или полное неисполнение 
                      обязательств, если это неисполнение явилось следствием обстоятельств 
                      непреодолимой силы (форс-мажор), включая: стихийные бедствия, военные действия, 
                      забастовки, изменения законодательства, решения государственных органов, 
                      масштабные технические сбои интернет-провайдеров или хостинговых компаний.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">11.4. Прекращение действия договора</h4>
                    <p className="text-muted-foreground mb-2">
                      Договор может быть прекращен:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>По инициативе пользователя - удалением аккаунта</li>
                      <li>По инициативе Администрации - при нарушении пользователем правил</li>
                      <li>При прекращении работы игрового сервиса</li>
                    </ul>
                    <p className="text-muted-foreground mt-2">
                      При прекращении договора пользователь теряет доступ к аккаунту и всем 
                      виртуальным активам без права на компенсацию, за исключением вывода 
                      доступного рублевого баланса (при отсутствии блокировок).
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">12. Контактная информация и поддержка</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">12.1. Способы обращения</h4>
                    <p className="text-muted-foreground mb-2">
                      По всем вопросам, связанным с исполнением настоящего договора, 
                      пользователи могут обращаться:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Через систему поддержки в игровом интерфейсе (раздел "Поддержка")</li>
                      <li>На страницу поддержки сервиса</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">12.2. Время ответа</h4>
                    <p className="text-muted-foreground">
                      Администрация стремится отвечать на обращения в течение 1-3 рабочих дней. 
                      В период высокой нагрузки время ответа может быть увеличено до 5-7 рабочих дней. 
                      Срочные вопросы, связанные с платежами, обрабатываются в приоритетном порядке.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">12.3. Документация</h4>
                    <p className="text-muted-foreground">
                      Дополнительную информацию можно найти на следующих страницах:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Правила игры - детальное описание игровых механик</li>
                      <li>Руководство пользователя - полный гайд по игре</li>
                      <li>Пользовательское соглашение - условия использования сервиса</li>
                      <li>FAQ - ответы на часто задаваемые вопросы</li>
                    </ul>
                  </div>
                </div>
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