import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Building2, User, Globe, Mail, FileText, Home, RefreshCw } from 'lucide-react';

interface CompanySetting {
  section_key: string;
  is_visible: boolean;
}

export function CompanyContentManager() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<CompanySetting[]>([]);
  const [loading, setLoading] = useState(true);

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
      description: '891151084170',
      icon: <FileText className="h-5 w-5" />
    },
    {
      key: 'ogrnip',
      name: 'ОГРНИП',
      description: '323890100010935',
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

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      setLoading(true);
      
      const savedSettings: CompanySetting[] = [];
      
      // Загрузка настроек разделов
      sectionConfigs.forEach(config => {
        const saved = localStorage.getItem(`company_section_${config.key}`);
        savedSettings.push({
          section_key: config.key,
          is_visible: saved !== null ? JSON.parse(saved) : true
        });
      });

      // Загрузка настроек реквизитов
      companyRequisiteConfigs.forEach(config => {
        const saved = localStorage.getItem(`company_requisite_${config.key}`);
        savedSettings.push({
          section_key: `requisite_${config.key}`,
          is_visible: saved !== null ? JSON.parse(saved) : true
        });
      });

      setSettings(savedSettings);
    } catch (error) {
      console.error('Error in loadSettings:', error);
      const defaultSettings = [
        ...sectionConfigs.map(config => ({
          section_key: config.key,
          is_visible: true
        })),
        ...companyRequisiteConfigs.map(config => ({
          section_key: `requisite_${config.key}`,
          is_visible: true
        }))
      ];
      setSettings(defaultSettings);
      
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить настройки видимости разделов",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = (sectionKey: string, newVisibility: boolean) => {
    try {
      let storageKey = '';
      let displayName = '';

      if (sectionKey.startsWith('requisite_')) {
        const requisiteKey = sectionKey.replace('requisite_', '');
        storageKey = `company_requisite_${requisiteKey}`;
        const config = companyRequisiteConfigs.find(r => r.key === requisiteKey);
        displayName = config?.name || sectionKey;
      } else {
        storageKey = `company_section_${sectionKey}`;
        const config = sectionConfigs.find(s => s.key === sectionKey);
        displayName = config?.name || sectionKey;
      }

      localStorage.setItem(storageKey, JSON.stringify(newVisibility));

      setSettings(prev => 
        prev.map(setting => 
          setting.section_key === sectionKey 
            ? { ...setting, is_visible: newVisibility }
            : setting
        )
      );

      toast({
        title: newVisibility ? "Элемент показан" : "Элемент скрыт",
        description: `"${displayName}" теперь ${newVisibility ? 'видим' : 'скрыт'} на странице "О компании"`,
      });
    } catch (error) {
      console.error('Error updating section visibility:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить настройки видимости",
        variant: "destructive",
      });
    }
  };

  const getSettingForSection = (sectionKey: string) => {
    return settings.find(s => s.section_key === sectionKey);
  };

  const applyToAllUsers = () => {
    // Очищаем localStorage от всех настроек компании
    sectionConfigs.forEach(config => {
      localStorage.removeItem(`company_section_${config.key}`);
    });

    companyRequisiteConfigs.forEach(config => {
      localStorage.removeItem(`company_requisite_${config.key}`);
    });

    // Перезагружаем текущие настройки
    loadSettings();

    toast({
      title: "Настройки применены",
      description: "Все пользователи получат актуальные настройки видимости при следующем входе",
    });
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
          </div>
        </div>

        {/* Реквизиты компании */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-accent">Реквизиты компании (детально)</h4>
          <div className="space-y-4">
            {companyRequisiteConfigs.map((config) => {
              const setting = getSettingForSection(`requisite_${config.key}`);
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
                    onCheckedChange={(checked) => toggleVisibility(`requisite_${config.key}`, checked)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/30 rounded">
          <p>
            <strong>Примечание:</strong> Скрытые разделы и реквизиты не будут отображаться на странице "О компании" для обычных пользователей.
            Администраторы всегда видят все разделы.
          </p>
        </div>

        {/* Кнопка применения для всех */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={applyToAllUsers}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Применить настройки для всех пользователей
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Сбросит все пользовательские настройки и применит текущие настройки видимости для всех
          </p>
        </div>
      </CardContent>
    </Card>
  );
}