import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface GlobalSetting {
  setting_key: string;
  setting_value: boolean;
  setting_type: 'page_visibility' | 'company_section' | 'company_requisite';
}

export const useGlobalSettings = () => {
  const [settings, setSettings] = useState<GlobalSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadSettings = () => {
    try {
      setLoading(true);
      const defaultSettings = getDefaultSettings();
      
      // Проверяем, есть ли админские настройки
      const adminSettings: GlobalSetting[] = defaultSettings.map(setting => {
        let storageKey: string;
        if (setting.setting_type === 'page_visibility') {
          storageKey = `admin_page_visibility_${setting.setting_key}`;
        } else if (setting.setting_type === 'company_section') {
          storageKey = `admin_company_section_${setting.setting_key}`;
        } else {
          storageKey = `admin_company_requisite_${setting.setting_key}`;
        }
        
        const saved = localStorage.getItem(storageKey);
        return {
          ...setting,
          setting_value: saved !== null ? JSON.parse(saved) : true
        };
      });
      
      setSettings(adminSettings);
    } catch (error) {
      console.error('Error loading global settings:', error);
      setSettings(getDefaultSettings());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSettings = (): GlobalSetting[] => [
    // Страницы
    { setting_key: 'offer', setting_value: true, setting_type: 'page_visibility' },
    { setting_key: 'terms', setting_value: true, setting_type: 'page_visibility' },
    
    // Разделы компании
    { setting_key: 'project_description', setting_value: true, setting_type: 'company_section' },
    { setting_key: 'contact_info', setting_value: true, setting_type: 'company_section' },
    { setting_key: 'navigation_buttons', setting_value: true, setting_type: 'company_section' },
    
    // Реквизиты компании
    { setting_key: 'owner', setting_value: false, setting_type: 'company_requisite' },
    { setting_key: 'project_name', setting_value: true, setting_type: 'company_requisite' },
    { setting_key: 'inn', setting_value: true, setting_type: 'company_requisite' },
    { setting_key: 'ogrnip', setting_value: true, setting_type: 'company_requisite' },
    { setting_key: 'email', setting_value: true, setting_type: 'company_requisite' },
    { setting_key: 'address', setting_value: true, setting_type: 'company_requisite' }
  ];

  const updateGlobalSetting = async (settingKey: string, settingType: string, value: boolean) => {
    try {
      // Сохраняем админские настройки
      let adminStorageKey: string;
      if (settingType === 'page_visibility') {
        adminStorageKey = `admin_page_visibility_${settingKey}`;
      } else if (settingType === 'company_section') {
        adminStorageKey = `admin_company_section_${settingKey}`;
      } else {
        adminStorageKey = `admin_company_requisite_${settingKey}`;
      }
      
      localStorage.setItem(adminStorageKey, JSON.stringify(value));
      
      // Очищаем пользовательские настройки, чтобы они использовали новые админские
      let userStorageKey: string;
      if (settingType === 'page_visibility') {
        userStorageKey = `page_visibility_${settingKey}`;
      } else if (settingType === 'company_section') {
        userStorageKey = `company_section_${settingKey}`;
      } else {
        userStorageKey = `company_requisite_${settingKey}`;
      }
      
      localStorage.removeItem(userStorageKey);

      // Обновляем локальное состояние
      setSettings(prev => 
        prev.map(setting => 
          setting.setting_key === settingKey && setting.setting_type === settingType
            ? { ...setting, setting_value: value }
            : setting
        )
      );

      toast({
        title: "Настройки обновлены",
        description: `Видимость "${settingKey}" ${value ? 'включена' : 'отключена'} для всех пользователей`,
      });

      return true;
    } catch (error) {
      console.error('Error updating global setting:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить настройки",
        variant: "destructive",
      });
      return false;
    }
  };

  const isPageVisible = (pageKey: string): boolean => {
    // Сначала проверяем админские настройки
    const adminSetting = localStorage.getItem(`admin_page_visibility_${pageKey}`);
    if (adminSetting !== null) {
      return JSON.parse(adminSetting);
    }
    
    // Затем пользовательские настройки
    const userSetting = localStorage.getItem(`page_visibility_${pageKey}`);
    if (userSetting !== null) {
      return JSON.parse(userSetting);
    }
    
    return true; // По умолчанию видимо
  };

  const isCompanySectionVisible = (sectionKey: string): boolean => {
    // Сначала проверяем админские настройки
    const adminSetting = localStorage.getItem(`admin_company_section_${sectionKey}`);
    if (adminSetting !== null) {
      return JSON.parse(adminSetting);
    }
    
    // Затем пользовательские настройки
    const userSetting = localStorage.getItem(`company_section_${sectionKey}`);
    if (userSetting !== null) {
      return JSON.parse(userSetting);
    }
    
    return true; // По умолчанию видимо
  };

  const isCompanyRequisiteVisible = (requisiteKey: string): boolean => {
    // Сначала проверяем админские настройки
    const adminSetting = localStorage.getItem(`admin_company_requisite_${requisiteKey}`);
    if (adminSetting !== null) {
      return JSON.parse(adminSetting);
    }
    
    // Затем пользовательские настройки
    const userSetting = localStorage.getItem(`company_requisite_${requisiteKey}`);
    if (userSetting !== null) {
      return JSON.parse(userSetting);
    }
    
    return true; // По умолчанию видимо
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    updateGlobalSetting,
    isPageVisible,
    isCompanySectionVisible,
    isCompanyRequisiteVisible,
    refreshSettings: loadSettings
  };
};