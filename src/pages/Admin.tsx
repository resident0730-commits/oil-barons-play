import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, Shield, LayoutDashboard, Users, Wallet, 
  Gamepad2, Link2, Settings, MessageSquare, BarChart 
} from 'lucide-react';
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
import { Card, CardContent } from '@/components/ui/card';

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
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
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
                <h1 className="text-2xl font-bold">Админ-панель</h1>
                <p className="text-sm text-muted-foreground">Управление игрой и пользователями</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <MoneyWithdrawal />
            <MoneyTransfer />
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 h-auto p-1">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Обзор</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 py-3">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Пользователи</span>
            </TabsTrigger>
            <TabsTrigger value="finance" className="flex items-center gap-2 py-3">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Финансы</span>
            </TabsTrigger>
            <TabsTrigger value="game" className="flex items-center gap-2 py-3">
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden sm:inline">Игра</span>
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2 py-3">
              <Link2 className="h-4 w-4" />
              <span className="hidden sm:inline">Рефералы</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 py-3">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Настройки</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Быстрые действия</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/support')}>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <MessageSquare className="h-10 w-10 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">Служба поддержки</h3>
                    <p className="text-xs text-muted-foreground">Управление заявками</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/statistics')}>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <BarChart className="h-10 w-10 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">Статистика</h3>
                    <p className="text-xs text-muted-foreground">Аналитика и отчеты</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Statistics */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Статистика платформы</h2>
              <AdminStats />
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Управление балансом</h2>
              <BalanceManager />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Пользователи</h2>
              <UserManagement />
            </div>
          </TabsContent>

          {/* Finance Tab */}
          <TabsContent value="finance" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Настройки валют</h2>
              <CurrencyManager />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Обработка выводов</h2>
              <WithdrawalProcessor />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">История операций</h2>
              <TransferHistory />
            </div>
          </TabsContent>

          {/* Game Tab */}
          <TabsContent value="game" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Управление скважинами</h2>
              <AdminWellManager />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Управление бустерами</h2>
              <BoosterManager />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Промокоды</h2>
              <PromoCodeManager />
            </div>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Реферальные цепочки и бонусы</h2>
              <ReferralChainManager />
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Настройки домена</h2>
              <DomainSettings />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Видимость страниц</h2>
              <PageVisibilityManager />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Контент компании</h2>
              <CompanyContentManager />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Миграция базы данных</h2>
              <DatabaseMigration />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
