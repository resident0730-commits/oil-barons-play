import { useEffect, useRef } from 'react';

interface RobokassaWidgetProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const RobokassaWidget = ({ amount, onSuccess, onError }: RobokassaWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    const loadRobokassaScript = () => {
      if (scriptLoadedRef.current || !containerRef.current) return;

      // Очищаем контейнер
      containerRef.current.innerHTML = '';

      // Создаем скрипт элемент
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://auth.robokassa.ru/Merchant/PaymentForm/FormFLS.js?EncodedInvoiceId=XTumKuXjjEiGsadaaQGPhQ&DefaultSum=${amount}`;
      script.async = true;

      script.onload = () => {
        console.log('Robokassa script loaded successfully');
        scriptLoadedRef.current = true;
        onSuccess?.();
      };

      script.onerror = () => {
        console.error('Failed to load Robokassa script');
        onError?.('Не удалось загрузить форму оплаты');
      };

      // Добавляем скрипт в контейнер
      containerRef.current.appendChild(script);
    };

    loadRobokassaScript();

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      scriptLoadedRef.current = false;
    };
  }, [amount, onSuccess, onError]);

  return (
    <div className="w-full">
      <div 
        ref={containerRef} 
        className="robokassa-widget-container w-full"
        style={{ 
          minHeight: '300px',
          width: '100%'
        }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          .robokassa-widget-container {
            width: 100%;
          }
          .robokassa-widget-container iframe {
            width: 100% !important;
            max-width: 100% !important;
            border: none;
            border-radius: 8px;
          }
        `
      }} />
    </div>
  );
};