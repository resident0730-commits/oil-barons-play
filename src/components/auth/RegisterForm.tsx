import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) {
      toast({
        variant: "destructive",
        title: "Требуется согласие",
        description: "Необходимо согласиться с условиями использования и публичной офертой",
      });
      return;
    }

    setLoading(true);

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Слабый пароль",
        description: "Пароль должен быть не менее 6 символов",
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await signUp(email, password, nickname || "Игрок");
      
      if (error) {
        throw error;
      }

      toast({
        title: "Регистрация успешна!",
        description: "Проверьте email для подтверждения аккаунта",
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка регистрации",
        description: error.message || "Попробуйте другой email",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserPlus className="h-5 w-5 mr-2" />
          Регистрация
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nickname">Никнейм</Label>
            <Input
              id="nickname"
              placeholder="Как вас называть?"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms-register"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            />
            <label
              htmlFor="terms-register"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Я согласен с{" "}
              <Link to="/terms" className="text-primary hover:underline" target="_blank">
                условиями использования
              </Link>
              {" "}и{" "}
              <Link to="/offer" className="text-primary hover:underline" target="_blank">
                публичной офертой
              </Link>
            </label>
          </div>
          <Button 
            type="submit" 
            className="w-full gradient-primary shadow-primary"
            disabled={loading || !acceptedTerms}
          >
            {loading ? "Создание..." : "Создать аккаунт"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}