import { useEffect } from 'react';

// Компонент-помощник для принудительного скрытия владельца
export const HideOwnerHelper = () => {
  useEffect(() => {
    // Принудительно устанавливаем скрытие владельца в локальном хранилище
    localStorage.setItem('admin_company_requisite_owner', JSON.stringify(false));
    localStorage.removeItem('company_requisite_owner'); // Убираем пользовательские настройки
  }, []);

  return null; // Этот компонент не рендерит ничего
};