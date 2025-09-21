import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, Building2, User, Globe, Mail, FileText, Home } from 'lucide-react';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';

export const CompanyContentManager = () => {
  const { settings, loading, updateGlobalSetting } = useGlobalSettings();

  const sectionConfigs = [
    {
      key: 'project_description',
      name: 'О проекте Oil Tycoon',
      description: 'Описание целей проекта и его особенностей',
      icon: <Globe className="h-5 w-5" />
    },
    {
      key: 'contact_info',
      name: 'Контактная информация',
      description: 'Раздел "Связаться с нами"',
      icon: <Mail className="h-5 w-5" />
    },
    {
      key: 'navigation_buttons',
      name: 'Навигационные кнопки',
      description: 'Кнопки "На главную" и "Правила игры"',
      icon: <Home className="h-5 w-5" />
    }
  ];

  const companyRequisiteConfigs = [
    {
      key: 'owner',
      name: 'Владелец проекта',
      description: 'ИП Захаров А.И.',
      icon: <User className="h-5 w-5" />
    },
    {
      key: 'project_name',
      name: 'Название проекта',
      description: 'Oil Tycoon',
      icon: <Globe className="h-5 w-5" />
    },
    {
      key: 'inn',
      name: 'ИНН',
      description: '881151084171',
      icon: <FileText className="h-5 w-5" />
    },
    {
      key: 'ogrnip',
      name: 'ОГРНИП',
      description: '323890100010934',
      icon: <FileText className="h-5 w-5" />
    },
    {
      key: 'email',
      name: 'Email для связи',
      description: 'oiltycoon.help@gmail.com',
      icon: <Mail className="h-5 w-5" />
    },
    {
      key: 'address',
      name: 'Адрес',
      description: 'г. Москва, ул. Тверская, д. 15, офис 301',
      icon: <Building2 className="h-5 w-5" />
    }
  ];

  const toggleVisibility = async (sectionKey: string, newVisibility: boolean) => {
    const isMainSection = sectionConfigs.find(s => s.key === sectionKey);
    const settingType = isMainSection ? 'company_section' : 'company_requisite';
    
    await updateGlobalSetting(sectionKey, settingType, newVisibility);
  };

  const getSettingForSection = (sectionKey: string) => {
    const isMainSection = sectionConfigs.find(s => s.key === sectionKey);
    const settingType = isMainSection ? 'company_section' : 'company_requisite';
    
    const setting = settings.find(s => s.setting_key === sectionKey && s.setting_type === settingType);
    return { section_key: sectionKey, is_visible: setting?.setting_value ?? true };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
            <span>Загрузка настроек разделов...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Управление разделами страницы "О компании"
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Основные разделы */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-primary">Основные разделы</h4>
          <div className="space-y-4">
            {sectionConfigs.map((config) => {
              const setting = getSettingForSection(config.key);
              const isVisible = setting?.is_visible ?? true;
              
              return (
                <div
                  key={config.key}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {isVisible ? (
                        <Eye className="h-5 w-5 text-green-500" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-red-500" />
                      )}
                      <div className="text-primary">
                        {config.icon}
                      </div>
                    </div>
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
          </div>
        </div>

        {/* Реквизиты компании */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-accent">Реквизиты компании (детально)</h4>
          <div className="space-y-4">
            {companyRequisiteConfigs.map((config) => {
              const setting = getSettingForSection(config.key);
              const isVisible = setting?.is_visible ?? true;
              
              return (
                <div
                  key={config.key}
                  className="flex items-center justify-between p-4 rounded-lg border bg-accent/5"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {isVisible ? (
                        <Eye className="h-5 w-5 text-green-500" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-red-500" />
                      )}
                      <div className="text-accent">
                        {config.icon}
                      </div>
                    </div>
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
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/30 rounded">
          <p>
            <strong>Примечание:</strong> Изменения автоматически применяются для всех пользователей через глобальную систему управления.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};