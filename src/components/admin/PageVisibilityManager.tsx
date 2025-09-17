import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Settings } from 'lucide-react';

interface PageSetting {
  page_key: string;
  is_visible: boolean;
}

export function PageVisibilityManager() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<PageSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const pageConfigs = [
    {
      key: 'offer',
      name: 'Публичная оферта',
      description: 'Договор оказания услуг игрового сервиса'
    },
    {
      key: 'terms',
      name: 'Пользовательское соглашение', 
      description: 'Условия использования сервиса'
    }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      setLoading(true);
      
      // Загружаем настройки из localStorage
      const savedSettings: PageSetting[] = [];
      
      pageConfigs.forEach(config => {
        const saved = localStorage.getItem(`page_visibility_${config.key}`);
        savedSettings.push({
          page_key: config.key,
          is_visible: saved !== null ? JSON.parse(saved) : true
        });
      });

      setSettings(savedSettings);
    } catch (error) {
      console.error('Error in loadSettings:', error);
      // Создаем настройки по умолчанию
      const defaultSettings = pageConfigs.map(config => ({
        page_key: config.key,
        is_visible: true
      }));
      setSettings(defaultSettings);
      
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить настройки видимости страниц",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const toggleVisibility = (pageKey: string, newVisibility: boolean) => {
    try {
      // Сохраняем в localStorage
      localStorage.setItem(`page_visibility_${pageKey}`, JSON.stringify(newVisibility));

      setSettings(prev => 
        prev.map(setting => 
          setting.page_key === pageKey 
            ? { ...setting, is_visible: newVisibility }
            : setting
        )
      );

      const config = pageConfigs.find(p => p.key === pageKey);
      toast({
        title: newVisibility ? "Страница показана" : "Страница скрыта",
        description: `"${config?.name}" теперь ${newVisibility ? 'видима' : 'скрыта'} для пользователей`,
      });
    } catch (error) {
      console.error('Error updating page visibility:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить настройки видимости",
        variant: "destructive",
      });
    }
  };

  const getSettingForPage = (pageKey: string) => {
    return settings.find(s => s.page_key === pageKey);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
            <span>Загрузка настроек...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Управление видимостью страниц
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pageConfigs.map((config) => {
          const setting = getSettingForPage(config.key);
          const isVisible = setting?.is_visible ?? true;
          
          return (
            <div
              key={config.key}
              className="flex items-center justify-between p-4 rounded-lg border bg-card/50"
            >
              <div className="flex items-center space-x-3">
                {isVisible ? (
                  <Eye className="h-5 w-5 text-green-500" />
                ) : (
                  <EyeOff className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <Label className="text-base font-medium">
                    {config.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {config.description}
                  </p>
                </div>
              </div>
              
              <Switch
                checked={isVisible}
                onCheckedChange={(checked) => toggleVisibility(config.key, checked)}
              />
            </div>
          );
        })}
        
        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/30 rounded">
          <p>
            <strong>Примечание:</strong> Скрытые страницы будут недоступны для обычных пользователей,
            но администраторы смогут получить к ним доступ через прямые ссылки.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}