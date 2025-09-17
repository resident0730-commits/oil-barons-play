import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useUserRole } from '@/hooks/useUserRole';

interface ProtectedRouteProps {
  children: ReactElement;
  pageKey: string;
  adminBypass?: boolean;
}

export function ProtectedRoute({ children, pageKey, adminBypass = true }: ProtectedRouteProps) {
  const { isPageVisible, loading: visibilityLoading } = usePageVisibility();
  const { isAdmin, loading: roleLoading } = useUserRole();
  
  if (visibilityLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Если страница скрыта и пользователь не админ (при включенном adminBypass)
  if (!isPageVisible(pageKey) && (!adminBypass || !isAdmin)) {
    return <Navigate to="/404" replace />;
  }

  return children;
}