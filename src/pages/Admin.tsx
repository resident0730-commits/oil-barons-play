import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, MessageSquare, BarChart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { AdminStats } from '@/components/admin/AdminStats';
import { UserManagement } from '@/components/admin/UserManagement';
import { BalanceManager } from '@/components/admin/BalanceManager';
import { AdminWellManager } from '@/components/admin/AdminWellManager';
import { MoneyWithdrawal } from '@/components/admin/MoneyWithdrawal';
import { MoneyTransfer } from '@/components/admin/MoneyTransfer';
import { TransferHistory } from '@/components/admin/TransferHistory';
import { WithdrawalProcessor } from '@/components/admin/WithdrawalProcessor';
import { BoosterManager } from '@/components/admin/BoosterManager';
import { PageVisibilityManager } from '@/components/admin/PageVisibilityManager';
import { CompanyContentManager } from '@/components/admin/CompanyContentManager';
import { DatabaseMigration } from '@/components/admin/DatabaseMigration';
import { CurrencyManager } from '@/components/admin/CurrencyManager';
import { PromoCodeManager } from '@/components/admin/PromoCodeManager';
import { DomainSettings } from '@/components/admin/DomainSettings';
import { ReferralChainManager } from '@/components/admin/ReferralChainManager';

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
          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Быстрые действия</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/support')}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <MessageSquare className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Служба поддержки</h3>
                  <p className="text-sm text-muted-foreground">Управление заявками пользователей</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/statistics')}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <BarChart className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Статистика</h3>
                  <p className="text-sm text-muted-foreground">Аналитика и отчеты</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Database Migration */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Миграция базы данных</h2>
            <DatabaseMigration />
          </div>

          {/* Currency Management */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Настройки валют</h2>
            <CurrencyManager />
          </div>

          {/* Page Visibility Management */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Управление страницами и доменом</h2>
            <div className="space-y-6">
              <DomainSettings />
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

          {/* Promo Code Management */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Управление промокодами</h2>
            <PromoCodeManager />
          </div>

          {/* Referral Chain Management */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Реферальные цепочки и бонусы</h2>
            <ReferralChainManager />
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
        </div>
      </div>
    </div>
  );
}