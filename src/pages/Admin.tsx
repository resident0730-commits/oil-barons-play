import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { AdminStats } from '@/components/admin/AdminStats';
import { UserManagement } from '@/components/admin/UserManagement';
import { BalanceManager } from '@/components/admin/BalanceManager';
import { SupportManagement } from '@/components/admin/SupportManagement';
import { AdminWellManager } from '@/components/admin/AdminWellManager';
import { MoneyWithdrawal } from '@/components/admin/MoneyWithdrawal';
import { MoneyTransfer } from '@/components/admin/MoneyTransfer';
import { TransferHistory } from '@/components/admin/TransferHistory';
import { WithdrawalProcessor } from '@/components/admin/WithdrawalProcessor';
import { BoosterManager } from '@/components/admin/BoosterManager';
import { BotManager } from '@/components/admin/BotManager';
import { PageVisibilityManager } from '@/components/admin/PageVisibilityManager';
import { CompanyContentManager } from '@/components/admin/CompanyContentManager';
import { CurrencyManager } from '@/components/admin/CurrencyManager';

// Admin component for managing game and users
export default function Admin() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();

  useEffect(() => {
    if (!authLoading && !roleLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
            
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Админ-панель</h1>
                <p className="text-muted-foreground">Управление игрой и пользователями</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <MoneyWithdrawal />
            <MoneyTransfer />
          </div>
        </div>

        <div className="space-y-8">
          {/* Currency Management */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Настройки валют</h2>
            <CurrencyManager />
          </div>

          {/* Page Visibility Management */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Управление страницами</h2>
            <div className="space-y-6">
              <PageVisibilityManager />
              <CompanyContentManager />
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Статистика</h2>
            <AdminStats />
          </div>

          {/* Balance Management */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Управление балансом</h2>
            <BalanceManager />
          </div>

          {/* Admin Wells Management */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Управление скважинами</h2>
            <AdminWellManager />
          </div>

          {/* Booster Management */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Управление бустерами</h2>
            <BoosterManager />
          </div>

          {/* Bot Management */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Управление демо-счетами</h2>
            <BotManager />
          </div>

          {/* Withdrawal Processing */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Обработка выводов</h2>
            <WithdrawalProcessor />
          </div>

          {/* Transfer History */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">История операций</h2>
            <TransferHistory />
          </div>

          {/* User Management */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Управление пользователями</h2>
            <UserManagement />
          </div>

          {/* Support Management */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Служба поддержки</h2>
            <SupportManagement />
          </div>
        </div>
      </div>
    </div>
  );
}