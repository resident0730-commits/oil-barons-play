import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff } from 'lucide-react';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';

export const PageVisibilityManager = () => {
  const { settings, loading, updateGlobalSetting } = useGlobalSettings();

  const pageConfigs = [
    { key: 'offer', name: 'Публичная оферта', description: 'Договор оказания услуг игрового сервиса' },
    { key: 'terms', name: 'Пользовательское соглашение', description: 'Условия использования сервиса Oil Tycoon' }
  ];

  const toggleVisibility = async (pageKey: string, newVisibility: boolean) => {
    await updateGlobalSetting(pageKey, 'page_visibility', newVisibility);
  };

  const getSettingForPage = (pageKey: string) => {
    const setting = settings.find(s => s.setting_key === pageKey && s.setting_type === 'page_visibility');
    return { page_key: pageKey, is_visible: setting?.setting_value ?? true };
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
                  <div className="text-base font-medium">
                    {config.name}
                  </div>
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
            <strong>Примечание:</strong> Изменения автоматически применяются для всех пользователей через глобальную систему управления.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};