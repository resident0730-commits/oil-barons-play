import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface RegisterFormProps {
  onSuccess?: () => void;
  referralCode?: string;
}

export function RegisterForm({ onSuccess, referralCode }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appliedReferralCode, setAppliedReferralCode] = useState(referralCode || "");
  const [referralCodeValid, setReferralCodeValid] = useState<boolean | null>(null);
  const [referralCodeChecking, setReferralCodeChecking] = useState(false);
  const [referrerNickname, setReferrerNickname] = useState<string | null>(null);
  const { signUp } = useAuth();
  const { toast } = useToast();

  // Применяем реферальный код автоматически, если он передан
  useEffect(() => {
    if (referralCode) {
      setAppliedReferralCode(referralCode);
      validateReferralCode(referralCode);
    }
  }, [referralCode]);

  // Проверяем реферальный код при изменении
  const validateReferralCode = async (code: string) => {
    if (!code || code.length < 3) {
      setReferralCodeValid(null);
      setReferrerNickname(null);
      return;
    }

    setReferralCodeChecking(true);
    try {
      const { data: referrers, error } = await supabase
        .rpc('lookup_referral_code', { code: code.toUpperCase() });

      if (!error && referrers && referrers.length > 0) {
        setReferralCodeValid(true);
        setReferrerNickname(referrers[0].nickname);
      } else {
        setReferralCodeValid(false);
        setReferrerNickname(null);
      }
    } catch (error) {
      setReferralCodeValid(false);
      setReferrerNickname(null);
    } finally {
      setReferralCodeChecking(false);
    }
  };

  // Debounce для проверки кода
  useEffect(() => {
    const timer = setTimeout(() => {
      if (appliedReferralCode) {
        validateReferralCode(appliedReferralCode);
      } else {
        setReferralCodeValid(null);
        setReferrerNickname(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [appliedReferralCode]);

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

    // Проверяем наличие и валидность реферального кода
    if (!appliedReferralCode) {
      toast({
        variant: "destructive",
        title: "Требуется реферальный код",
        description: "Регистрация возможна только по приглашению. Введите реферальный код.",
      });
      return;
    }

    if (referralCodeValid !== true) {
      toast({
        variant: "destructive",
        title: "Неверный реферальный код",
        description: "Проверьте правильность введённого кода приглашения.",
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

      // Применяем реферальный код после регистрации
      if (appliedReferralCode && data?.user) {
        try {
          const { data: referrers, error: referrerError } = await supabase
            .rpc('lookup_referral_code', { code: appliedReferralCode.toUpperCase() });

          if (!referrerError && referrers && referrers.length > 0) {
            const referrer = referrers[0];
            
            // Обновляем профиль нового пользователя
            await supabase
              .from('profiles')
              .update({ referred_by: referrer.user_id })
              .eq('user_id', data.user.id);

            // Создаем запись о реферале
            await supabase
              .from('referrals')
              .insert({
                referrer_id: referrer.user_id,
                referred_id: data.user.id,
                referral_code: appliedReferralCode.toUpperCase(),
                is_active: true
              });
          }
        } catch (refError) {
          console.error('Error applying referral code:', refError);
        }
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

  const isFormValid = acceptedTerms && referralCodeValid === true && email && password;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserPlus className="h-5 w-5 mr-2" />
          Регистрация
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-amber-600">
          <Shield className="h-4 w-4" />
          Регистрация только по приглашению
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Реферальный код - обязательное поле */}
          <div className="space-y-2">
            <Label htmlFor="referralCode" className="flex items-center gap-2">
              Реферальный код <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="referralCode"
                placeholder="Введите код приглашения"
                value={appliedReferralCode}
                onChange={(e) => setAppliedReferralCode(e.target.value.toUpperCase())}
                className={`pr-10 ${
                  referralCodeValid === true 
                    ? 'border-green-500 focus-visible:ring-green-500' 
                    : referralCodeValid === false 
                    ? 'border-destructive focus-visible:ring-destructive' 
                    : ''
                }`}
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {referralCodeChecking && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {!referralCodeChecking && referralCodeValid === true && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {!referralCodeChecking && referralCodeValid === false && (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>
            {referralCodeValid === true && referrerNickname && (
              <p className="text-sm text-green-600">
                Приглашение от: {referrerNickname}
              </p>
            )}
            {referralCodeValid === false && (
              <p className="text-sm text-destructive">
                Код не найден. Проверьте правильность ввода.
              </p>
            )}
          </div>

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
            disabled={loading || !isFormValid}
          >
            {loading ? "Создание..." : "Создать аккаунт"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}