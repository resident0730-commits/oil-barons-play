import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface RobokassaWidgetProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const RobokassaWidget = ({ amount, onSuccess, onError }: RobokassaWidgetProps) => {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentParams, setPaymentParams] = useState<any>(null);
  const { toast } = useToast();
  const { session, user } = useAuth();

  const createPayment = async () => {
    if (!session || !user) {
      toast({
        title: "Ошибка авторизации",
        description: "Войдите в систему для создания платежа",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-robokassa-payment', {
        body: {
          amount: amount,
          description: `Пополнение баланса Oil Tycoon на ${amount}₽`
        }
      });

      if (error) {
        console.error('Robokassa payment error:', error);
        onError?.('Не удалось создать платеж');
        toast({
          title: "Ошибка создания платежа",
          description: "Попробуйте позже или выберите другой способ оплаты",
          variant: "destructive"
        });
        return;
      }

      if (data && data.success) {
        setPaymentUrl(data.paymentUrl);
        setPaymentParams(data.params);
        onSuccess?.();
        toast({
          title: "Платеж создан",
          description: "Нажмите кнопку для перехода к оплате",
        });
      }
    } catch (error) {
      console.error('Payment creation failed:', error);
      onError?.('Не удалось создать платеж');
      toast({
        title: "Ошибка",
        description: "Не удалось создать платеж. Проверьте подключение к интернету.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayment = () => {
    if (!paymentUrl || !paymentParams) return;

    // Создаем форму для отправки в Robokassa
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentUrl;
    form.target = '_blank';

    Object.entries(paymentParams).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value as string;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    toast({
      title: "Переход к оплате",
      description: "Вы перенаправлены на страницу оплаты Robokassa",
    });
  };

  return (
    <div className="w-full space-y-4">
      <div className="p-6 border rounded-lg bg-muted/20">
        <div className="text-center space-y-4">
          <div className="text-lg font-semibold">
            Сумма к оплате: {amount} ₽
          </div>
          
          {!paymentUrl ? (
            <Button 
              onClick={createPayment}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Создание платежа...' : 'Создать платеж'}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Платеж создан успешно! Нажмите кнопку для перехода к оплате.
              </div>
              <Button 
                onClick={handleSubmitPayment}
                className="w-full"
                size="lg"
              >
                Перейти к оплате через Robokassa
              </Button>
              <div className="text-xs text-muted-foreground">
                Вы будете перенаправлены на безопасную страницу оплаты
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};