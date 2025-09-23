import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const DatabaseMigration = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string>('');

  const runMigration = async () => {
    setIsRunning(true);
    setResult('');

    try {
      const { data, error } = await supabase.functions.invoke('add-attachments-column', {
        body: {}
      });

      if (error) throw error;

      setResult('success');
      toast({
        title: 'Миграция выполнена',
        description: 'Поле attachments успешно добавлено в таблицу support_tickets'
      });
    } catch (error) {
      console.error('Migration error:', error);
      setResult('error');
      toast({
        variant: 'destructive',
        title: 'Ошибка миграции',
        description: 'Не удалось выполнить миграцию базы данных'
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Миграция базы данных
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Добавить поле attachments в таблицу support_tickets для поддержки прикрепления скриншотов к заявкам.
          </p>
          {result === 'error' && (
            <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium">Альтернативный способ:</p>
              <p className="text-sm text-yellow-700 mt-1">
                Если автоматическая миграция не работает, выполните SQL команду вручную в Supabase Dashboard → SQL Editor:
              </p>
              <code className="block mt-2 p-2 bg-yellow-50 text-xs text-yellow-900 rounded">
                ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS attachments TEXT[];
              </code>
            </div>
          )}
        </div>
        
        <Button 
          onClick={runMigration}
          disabled={isRunning || result === 'success'}
          className="w-full"
        >
          {isRunning ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Выполнение миграции...
            </div>
          ) : result === 'success' ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Миграция выполнена
            </div>
          ) : result === 'error' ? (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Повторить миграцию
            </div>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Выполнить миграцию
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};