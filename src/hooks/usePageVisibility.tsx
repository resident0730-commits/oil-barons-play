import { useGlobalSettings } from './useGlobalSettings';

// Хук-обертка для совместимости с существующим кодом
export const usePageVisibility = () => {
  const globalSettings = useGlobalSettings();

  return {
    isPageVisible: globalSettings.isPageVisible,
    isCompanySectionVisible: globalSettings.isCompanySectionVisible,
    isCompanyRequisiteVisible: globalSettings.isCompanyRequisiteVisible,
    pageSettings: globalSettings.settings.filter(s => s.setting_type === 'page_visibility'),
    companySettings: globalSettings.settings.filter(s => s.setting_type === 'company_section'),
    companyRequisiteSettings: globalSettings.settings.filter(s => s.setting_type === 'company_requisite'),
    loading: globalSettings.loading,
    refreshSettings: globalSettings.refreshSettings
  };
};