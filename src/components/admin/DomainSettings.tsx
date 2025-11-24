import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Globe, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DomainSettings = () => {
  const [domain, setDomain] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Загружаем сохраненный домен
    const savedDomain = localStorage.getItem('custom_domain');
    if (savedDomain) {
      setDomain(savedDomain);
    }
  }, []);

  const saveDomain = () => {
    if (domain) {
      // Убираем слэш в конце если есть
      const cleanDomain = domain.replace(/\/$/, '');
      localStorage.setItem('custom_domain', cleanDomain);
      toast({
        title: "Домен сохранен",
        description: "Теперь реферальные ссылки будут использовать этот домен",
      });
    } else {
      localStorage.removeItem('custom_domain');
      toast({
        title: "Домен удален",
        description: "Будет использоваться текущий домен сайта",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Настройка домена
        </CardTitle>
        <CardDescription>
          Укажите ваш кастомный домен для реферальных ссылок
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Основной домен сайта
          </label>
          <Input
            type="url"
            placeholder="https://ваш-домен.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Укажите полный URL вашего домена, например: https://example.com (без слэша в конце)
          </p>
        </div>

        <Button onClick={saveDomain} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Сохранить домен
        </Button>

        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded">
          <p className="mb-2">
            <strong>Как это работает:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Если домен не указан, используется текущий домен сайта</li>
            <li>После публикации на кастомном домене он автоматически подставится</li>
            <li>Эта настройка полезна для preview, чтобы сразу видеть правильные ссылки</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};