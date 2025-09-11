import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const ADMIN_SECRET = "oil_admin_2024";

export function AdminPromotion() {
  const { user } = useAuth();
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const handlePromoteToAdmin = async () => {
    if (!user) {
      toast.error('Необходимо авторизоваться');
      return;
    }

    if (secret !== ADMIN_SECRET) {
      toast.error('Неверный секретный код');
      setSecret('');
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('promote_to_admin', {
        _user_id: user.id
      });

      if (error) {
        console.error('Error promoting to admin:', error);
        toast.error('Ошибка получения прав администратора');
      } else {
        toast.success('Вы получили права администратора! Перезагрузите страницу.');
        setSecret('');
        
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Error promoting to admin:', error);
      toast.error('Ошибка получения прав администратора');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-dashed border-muted-foreground/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-muted-foreground" />
          Разработчикам
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-secret" className="text-sm text-muted-foreground">
            Секретный код для получения прав администратора
          </Label>
          <div className="relative">
            <Input
              id="admin-secret"
              type={showSecret ? "text" : "password"}
              placeholder="Введите секретный код..."
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowSecret(!showSecret)}
            >
              {showSecret ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
        
        <Button
          onClick={handlePromoteToAdmin}
          disabled={loading || !secret.trim()}
          variant="outline"
          size="sm"
          className="w-full"
        >
          {loading ? 'Обработка...' : 'Получить права администратора'}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Секретный код: <code className="bg-muted px-1 rounded">oil_admin_2024</code>
        </p>
      </CardContent>
    </Card>
  );
}