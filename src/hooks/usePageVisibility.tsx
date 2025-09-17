import { useState, useEffect } from 'react';

interface PageSettings {
  [key: string]: boolean;
}

interface CompanySettings {
  [key: string]: boolean;
}

interface CompanyRequisiteSettings {
  [key: string]: boolean;
}

export const usePageVisibility = () => {
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    offer: true,
    terms: true
  });
  
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    project_description: true,
    contact_info: true,
    navigation_buttons: true
  });
  
  const [companyRequisiteSettings, setCompanyRequisiteSettings] = useState<CompanyRequisiteSettings>({
    owner: true,
    project_name: true,
    inn: true,
    ogrnip: true,
    email: true,
    address: true
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPageSettings();
  }, []);

  const loadPageSettings = () => {
    try {
      setLoading(true);
      
      // Загрузка настроек страниц
      const settings: PageSettings = {};
      const pages = ['offer', 'terms'];
      
      pages.forEach(pageKey => {
        const saved = localStorage.getItem(`page_visibility_${pageKey}`);
        settings[pageKey] = saved !== null ? JSON.parse(saved) : true;
      });
      
      setPageSettings(settings);
      
      // Загрузка настроек разделов компании
      const companySections: CompanySettings = {};
      const sections = ['project_description', 'contact_info', 'navigation_buttons'];
      
      sections.forEach(sectionKey => {
        const saved = localStorage.getItem(`company_section_${sectionKey}`);
        companySections[sectionKey] = saved !== null ? JSON.parse(saved) : true;
      });
      
      setCompanySettings(companySections);

      // Загрузка настроек реквизитов компании
      const companyRequisites: CompanyRequisiteSettings = {};
      const requisites = ['owner', 'project_name', 'inn', 'ogrnip', 'email', 'address'];
      
      requisites.forEach(requisiteKey => {
        const saved = localStorage.getItem(`company_requisite_${requisiteKey}`);
        companyRequisites[requisiteKey] = saved !== null ? JSON.parse(saved) : true;
      });
      
      setCompanyRequisiteSettings(companyRequisites);
    } catch (error) {
      console.error('Error in loadPageSettings:', error);
      // Используем настройки по умолчанию
      setPageSettings({
        offer: true,
        terms: true
      });
      setCompanySettings({
        project_description: true,
        contact_info: true,
        navigation_buttons: true
      });
      setCompanyRequisiteSettings({
        owner: true,
        project_name: true,
        inn: true,
        ogrnip: true,
        email: true,
        address: true
      });
    } finally {
      setLoading(false);
    }
  };

  const isPageVisible = (pageKey: string): boolean => {
    return pageSettings[pageKey] ?? true; // По умолчанию страницы видимы
  };

  const isCompanySectionVisible = (sectionKey: string): boolean => {
    return companySettings[sectionKey] ?? true; // По умолчанию разделы видимы
  };

  const isCompanyRequisiteVisible = (requisiteKey: string): boolean => {
    return companyRequisiteSettings[requisiteKey] ?? true; // По умолчанию реквизиты видимы
  };

  return {
    isPageVisible,
    isCompanySectionVisible,
    isCompanyRequisiteVisible,
    pageSettings,
    companySettings,
    companyRequisiteSettings,
    loading,
    refreshSettings: loadPageSettings
  };
};