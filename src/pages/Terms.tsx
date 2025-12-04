import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Fuel, ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
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
            <h1 className="text-3xl font-bold">Пользовательское соглашение</h1>
            <p className="text-muted-foreground">
              Условия использования сервиса Oil Tycoon
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Общие положения
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">1. Предмет соглашения</h3>
                <p className="text-muted-foreground mb-4">
                  Настоящее пользовательское соглашение регулирует отношения между администрацией 
                  игрового сервиса "Oil Tycoon" и пользователями данного сервиса.
                </p>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">1.1. Закрытая регистрация</h4>
                  <p className="text-muted-foreground mb-2">
                    Сервис Oil Tycoon работает в режиме закрытой регистрации:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li><strong>Для регистрации требуется реферальный код</strong> - пользователь должен получить действующий реферальный код от существующего участника проекта</li>
                    <li>Реферальный код является обязательным условием создания аккаунта</li>
                    <li>Без указания корректного реферального кода регистрация невозможна</li>
                    <li>Администрация может изменять условия доступа к регистрации без предварительного уведомления</li>
                  </ul>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">2. Права и обязанности пользователя</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">2.1. Пользователь имеет право:</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Использовать все функции игрового сервиса в соответствии с их назначением</li>
                      <li>Получать техническую поддержку по вопросам использования сервиса</li>
                      <li>Обращаться с жалобами и предложениями по улучшению игры</li>
                      <li>Удалить свой аккаунт в любое время</li>
                      <li>Получать информацию об изменениях в игровых механиках</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">2.2. Пользователь обязуется:</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Предоставлять достоверную информацию при регистрации</li>
                      <li>Соблюдать правила игры и не нарушать работоспособность сервиса</li>
                      <li>Не использовать автоматизированные средства для игры (боты, скрипты)</li>
                      <li>Не создавать множественные аккаунты для получения преимуществ</li>
                      <li>Не передавать свой аккаунт третьим лицам</li>
                      <li>Не пытаться получить несанкционированный доступ к игровым системам</li>
                      <li>Не использовать эксплойты, баги и уязвимости игровых механик</li>
                      <li>Не распространять вредоносное программное обеспечение</li>
                      <li>Соблюдать правила приличия и не оскорблять других пользователей</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">2.3. Запрещенные действия:</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Попытки взлома или получения доступа к чужим аккаунтам</li>
                      <li>Продажа, покупка или обмен аккаунтов за реальные деньги</li>
                      <li>Использование читов, модификаций клиента или программ автоматизации</li>
                      <li>Злоупотребление системой рефералов или ежедневных бонусов</li>
                      <li>Публикация оскорбительного, порнографического или противозаконного контента</li>
                      <li>DDoS-атаки и другие действия, нарушающие работу сервиса</li>
                      <li>Попытки обмана службы поддержки или администрации</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">3. Ответственность сторон</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">3.1. Ответственность Администрации</h4>
                    <p className="text-muted-foreground mb-2">
                      Администрация обязуется:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Обеспечивать доступность сервиса в режиме 24/7 (за исключением технических работ)</li>
                      <li>Сохранять игровой прогресс пользователей</li>
                      <li>Предоставлять техническую поддержку</li>
                      <li>Защищать персональные данные пользователей</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">3.2. Ограничение ответственности</h4>
                    <p className="text-muted-foreground mb-2">
                      Администрация не несет ответственности за:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Временную недоступность сервиса по техническим причинам</li>
                      <li>Потерю игрового прогресса вследствие форс-мажорных обстоятельств</li>
                      <li>Любые косвенные убытки или упущенную выгоду пользователей</li>
                      <li>Качество интернет-соединения пользователя</li>
                      <li>Действия третьих лиц, включая хакерские атаки</li>
                      <li>Эмоциональный дискомфорт от игрового процесса</li>
                    </ul>
                    <p className="text-muted-foreground mt-2">
                      Oil Tycoon является развлекательной игрой. Максимальная ответственность 
                      Администрации ограничивается восстановлением доступа к сервису. Все виртуальные 
                      активы в игре не имеют реальной денежной стоимости за пределами игровой экономики.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">3.3. Ответственность пользователя</h4>
                    <p className="text-muted-foreground mb-2">
                      Пользователь несет полную ответственность за:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Сохранность своих учетных данных (логин, пароль)</li>
                      <li>Все действия, совершенные с его аккаунта</li>
                      <li>Соблюдение правил игры и настоящего соглашения</li>
                      <li>Законность источника средств при покупке игровой валюты</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">4. Санкции и блокировка аккаунта</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">4.1. Основания для применения санкций</h4>
                    <p className="text-muted-foreground mb-2">
                      Администрация вправе применить санкции в случае:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Нарушения правил игры или пользовательского соглашения</li>
                      <li>Использования читов, ботов или эксплойтов</li>
                      <li>Создания множественных аккаунтов</li>
                      <li>Попыток взлома или мошенничества</li>
                      <li>Оскорбительного поведения по отношению к другим пользователям</li>
                      <li>Попыток обмана администрации или службы поддержки</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">4.2. Виды санкций</h4>
                    <p className="text-muted-foreground mb-2">
                      В зависимости от тяжести нарушения могут быть применены:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li><strong>Предупреждение</strong> - уведомление о нарушении без блокировки функций</li>
                      <li><strong>Временная блокировка</strong> - ограничение доступа на срок от 1 до 30 дней</li>
                      <li><strong>Перманентная блокировка</strong> - полное прекращение доступа к аккаунту</li>
                      <li><strong>Обнуление прогресса</strong> - сброс игровых достижений и баланса</li>
                      <li><strong>Блокировка вывода средств</strong> - запрет на вывод рублевого баланса</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">4.3. Процедура обжалования</h4>
                    <p className="text-muted-foreground">
                      Пользователь может обжаловать примененные санкции через систему поддержки 
                      в течение 30 дней с момента блокировки. Администрация рассматривает апелляции 
                      в течение 3-7 рабочих дней. Решение администрации является окончательным.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">5. Конфиденциальность и защита данных</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">5.1. Политика конфиденциальности</h4>
                    <p className="text-muted-foreground">
                      Администрация обязуется защищать персональные данные пользователей в соответствии с 
                      действующим законодательством РФ о персональных данных (152-ФЗ). Данные используются 
                      исключительно для функционирования игрового процесса и не передаются третьим лицам 
                      без согласия пользователя, за исключением случаев, предусмотренных законом.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">5.2. Согласие на обработку</h4>
                    <p className="text-muted-foreground">
                      Регистрируясь на сервисе, пользователь дает согласие на сбор, хранение и обработку 
                      своих персональных данных. Пользователь вправе отозвать согласие в любое время, 
                      что повлечет удаление аккаунта и всех связанных данных.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">5.3. Безопасность данных</h4>
                    <p className="text-muted-foreground mb-2">
                      Для защиты данных применяются следующие меры:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Шифрование паролей с использованием современных алгоритмов</li>
                      <li>Защищенное SSL/TLS соединение для передачи данных</li>
                      <li>Регулярное резервное копирование базы данных</li>
                      <li>Мониторинг и предотвращение несанкционированного доступа</li>
                      <li>Ограничение доступа персонала к персональным данным</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">6. Изменения игрового баланса и механик</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">6.1. Право на изменения</h4>
                    <p className="text-muted-foreground">
                      Администрация оставляет за собой право изменять игровые механики, балансировку, 
                      стоимость внутриигровых предметов, курсы обмена валют без предварительного 
                      уведомления пользователей. Такие изменения направлены на улучшение игрового 
                      опыта и поддержание игровой экономики.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">6.2. Отсутствие компенсаций</h4>
                    <p className="text-muted-foreground">
                      Пользователи не имеют права требовать компенсации за изменения в игровом 
                      балансе, включая изменение доходности скважин, стоимости улучшений или 
                      других игровых параметров. Приобретая виртуальные активы, пользователь 
                      соглашается с возможностью таких изменений.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">7. Технические требования и доступность</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">7.1. Системные требования</h4>
                    <p className="text-muted-foreground mb-2">
                      Для комфортной игры рекомендуется:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Современный веб-браузер (Chrome, Firefox, Safari, Edge последних версий)</li>
                      <li>Стабильное интернет-соединение со скоростью не менее 1 Мбит/с</li>
                      <li>Разрешение экрана не менее 1280x720</li>
                      <li>Включенный JavaScript</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">7.2. Технические работы</h4>
                    <p className="text-muted-foreground">
                      Администрация вправе проводить плановые технические работы с временным 
                      ограничением доступа к сервису. По возможности пользователи уведомляются 
                      заранее. В период технических работ начисление игрового дохода продолжается.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">8. Изменения соглашения</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">8.1. Уведомление об изменениях</h4>
                    <p className="text-muted-foreground">
                      Администрация оставляет за собой право изменять условия настоящего соглашения 
                      в любое время. Пользователи уведомляются об изменениях через игровой интерфейс, 
                      системные сообщения или email. Существенные изменения публикуются не менее чем 
                      за 7 дней до вступления в силу.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">8.2. Принятие изменений</h4>
                    <p className="text-muted-foreground">
                      Продолжение использования сервиса после внесения изменений означает согласие 
                      пользователя с новой версией соглашения. При несогласии с изменениями 
                      пользователь обязан прекратить использование сервиса.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">9. Заключительные положения</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">9.1. Согласие с условиями</h4>
                    <p className="text-muted-foreground">
                      Продолжая использование сервиса, пользователь подтверждает, что:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Полностью прочитал и понял условия настоящего соглашения</li>
                      <li>Достиг возраста 18 лет или имеет согласие родителей/опекунов</li>
                      <li>Согласен со всеми положениями без исключений</li>
                      <li>Обязуется соблюдать правила и условия использования сервиса</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">9.2. Прекращение использования</h4>
                    <p className="text-muted-foreground">
                      При несогласии с условиями соглашения пользователь обязан немедленно 
                      прекратить использование сервиса. Аккаунт может быть удален пользователем 
                      самостоятельно через настройки профиля или по запросу в службу поддержки.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">9.3. Применимое право</h4>
                    <p className="text-muted-foreground">
                      Настоящее соглашение регулируется и толкуется в соответствии с 
                      законодательством Российской Федерации. Все споры, возникающие из 
                      настоящего соглашения или в связи с ним, подлежат разрешению в 
                      соответствии с действующим законодательством РФ.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">9.4. Контактная информация</h4>
                    <p className="text-muted-foreground">
                      По всем вопросам, касающимся настоящего соглашения, пользователи могут 
                      обращаться через систему поддержки в игровом интерфейсе или на странице 
                      поддержки сервиса. Администрация стремится отвечать на обращения в 
                      течение 1-3 рабочих дней.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">9.5. Делимость положений</h4>
                    <p className="text-muted-foreground">
                      Если какое-либо положение настоящего соглашения будет признано 
                      недействительным или не подлежащим принудительному исполнению, остальные 
                      положения сохраняют полную силу и действие.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="outline">
                  Вернуться на главную
                </Button>
              </Link>
              <Link to="/offer">
                <Button variant="secondary">
                  Публичная оферта
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export { Terms };