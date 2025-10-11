import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RobokassaWidgetProps {
  amount: number;
  totalAmount?: number;
  promoCode?: string;
  onSuccess?: (invoiceId?: string) => void;
  onError?: (error: string) => void;
}

export const RobokassaWidget = ({ amount, totalAmount, promoCode, onSuccess, onError }: RobokassaWidgetProps) => {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentParams, setPaymentParams] = useState<any>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const { toast } = useToast();

  const createPayment = async () => {
    console.log('🎯 Starting payment creation process');
    
    setLoading(true);
    console.log('💰 Creating payment for amount:', amount);
    
    try {
      // Получаем текущего пользователя
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('❌ User not authenticated');
        onError?.('Необходимо войти в систему');
        toast({
          title: "Ошибка аутентификации",
          description: "Войдите в систему для продолжения",
          variant: "destructive"
        });
        return;
      }
      
      console.log('👤 User ID:', user.id);
      
      const { data, error } = await supabase.functions.invoke('robokassa-payment', {
        body: {
          amount: amount,
          totalAmount: totalAmount || amount, // Передаем сумму с бонусом
          userId: user.id,
          description: `Пополнение баланса Oil Tycoon на ${amount}₽${totalAmount && totalAmount > amount ? ` (получите ${totalAmount}₽)` : ''}`
        }
      });

      console.log('📡 Robokassa function response:', { data, error });

      if (error) {
        console.error('❌ Robokassa payment error:', error);
        onError?.('Не удалось создать платеж');
        toast({
          title: "Ошибка создания платежа",
          description: "Попробуйте позже или выберите другой способ оплаты",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Response data:', data);
      
      if (data && data.success) {
        console.log('🎉 Payment created successfully!');
        console.log('🔗 Payment URL:', data.paymentUrl);
        console.log('📝 Payment params:', data.params);
        console.log('🆔 Invoice ID:', data.invoiceId);
        
        setPaymentUrl(data.paymentUrl);
        setPaymentParams(data.params);
        setInvoiceId(data.invoiceId);
        
        // Сразу перенаправляем на оплату
        setTimeout(() => {
          console.log('⚡ Автоматическое перенаправление на оплату');
          
          const url = new URL(data.paymentUrl);
          Object.entries(data.params).forEach(([key, value]) => {
            url.searchParams.set(key, value as string);
            console.log(`📝 Added URL param: ${key} = ${value}`);
          });

          const finalUrl = url.toString();
          console.log('🌐 Final payment URL:', finalUrl);

          // Открываем в новой вкладке
          const newWindow = window.open(finalUrl, '_blank');
          
          if (newWindow) {
            console.log('✅ Payment window opened successfully');
            toast({
              title: "Переход к оплате",
              description: "Открыта страница оплаты Robokassa",
            });
            onSuccess?.(data.invoiceId);
          } else {
            console.error('❌ Failed to open payment window - popup blocked?');
            toast({
              title: "Ошибка",
              description: "Не удалось открыть окно оплаты. Разрешите всплывающие окна.",
              variant: "destructive"
            });
          }
        }, 1000);
      } else {
        console.error('❌ Success flag is false or missing');
        onError?.('Некорректный ответ от сервера');
      }
    } catch (error) {
      console.error('💥 Payment creation failed:', error);
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
    console.log('🚀 Starting payment submission');
    console.log('🔗 Payment URL:', paymentUrl);
    console.log('📝 Payment params:', paymentParams);
    
    if (!paymentUrl || !paymentParams) {
      console.error('❌ Missing payment URL or params');
      toast({
        title: "Ошибка",
        description: "Отсутствуют данные для оплаты",
        variant: "destructive"
      });
      return;
    }

    // Создаем URL с GET параметрами вместо POST формы
    const url = new URL(paymentUrl);
    Object.entries(paymentParams).forEach(([key, value]) => {
      url.searchParams.set(key, value as string);
      console.log(`📝 Added URL param: ${key} = ${value}`);
    });

    const finalUrl = url.toString();
    console.log('🌐 Final payment URL:', finalUrl);

    // Открываем в новой вкладке
    const newWindow = window.open(finalUrl, '_blank');
    
    if (newWindow) {
      console.log('✅ Payment window opened successfully');
      toast({
        title: "Переход к оплате",
        description: "Открыта страница оплаты Robokassa",
      });
    } else {
      console.error('❌ Failed to open payment window - popup blocked?');
      toast({
        title: "Ошибка",
        description: "Не удалось открыть окно оплаты. Разрешите всплывающие окна.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="p-6 border rounded-lg bg-muted/20">
        <div className="text-center space-y-4">
          <div className="text-lg font-semibold">
            Сумма к оплате: {amount} ₽
          </div>
          {totalAmount && totalAmount > amount && (
            <div className="text-sm text-primary font-medium">
              Вы получите: {totalAmount} ₽ (бонус: +{totalAmount - amount} ₽)
            </div>
          )}
          
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
                onClick={() => {
                  console.log('🔥 КНОПКА НАЖАТА! Начинаем переход к оплате');
                  handleSubmitPayment();
                }}
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