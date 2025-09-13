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
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">2. Права и обязанности пользователя</h3>
                <p className="text-muted-foreground mb-2">
                  Пользователь обязуется:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Предоставлять достоверную информацию при регистрации</li>
                  <li>Не нарушать работоспособность сервиса</li>
                  <li>Не использовать автоматизированные средства для игры</li>
                  <li>Соблюдать правила игры и не создавать множественные аккаунты</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">3. Ответственность</h3>
                <p className="text-muted-foreground mb-4">
                  Oil Tycoon является развлекательной игрой. Администрация не несет ответственности 
                  за любые убытки, связанные с использованием сервиса. Все виртуальные активы 
                  в игре не имеют реальной денежной стоимости.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">4. Конфиденциальность</h3>
                <p className="text-muted-foreground mb-4">
                  Мы обязуемся защищать персональные данные пользователей в соответствии с 
                  действующим законодательством. Данные используются исключительно для 
                  функционирования игрового процесса.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">5. Изменения соглашения</h3>
                <p className="text-muted-foreground mb-4">
                  Администрация оставляет за собой право изменять условия настоящего соглашения. 
                  Пользователи уведомляются об изменениях через игровой интерфейс.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">6. Заключительные положения</h3>
                <p className="text-muted-foreground mb-4">
                  Продолжая использование сервиса, пользователь подтверждает свое согласие с 
                  условиями данного соглашения. При несогласии с условиями необходимо 
                  прекратить использование сервиса.
                </p>
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

export default Terms;