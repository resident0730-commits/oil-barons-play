import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Zap } from 'lucide-react';
import { useGameData } from '@/hooks/useGameData';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function AdminWellManager() {
  const { wells, reload } = useGameData();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDeleteWell = async (wellId: string, wellType: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Delete the well
      const { error: deleteError } = await supabase
        .from('wells')
        .delete()
        .eq('id', wellId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Recalculate daily income after deletion
      await reload();

      toast({
        title: "Скважина удалена",
        description: `${wellType} успешно удалена`,
      });
    } catch (error: any) {
      console.error('Error deleting well:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить скважину",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!wells || wells.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Управление скважинами
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">У вас нет скважин для управления.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Управление скважинами ({wells.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {wells.map((well) => (
            <div key={well.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{well.well_type}</h4>
                <div className="text-sm text-muted-foreground">
                  <span>Уровень {well.level}</span>
                  <span className="mx-2">•</span>
                  <span>{well.daily_income.toLocaleString()} ₽/день</span>
                </div>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Удалить
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Удалить скважину?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Вы уверены, что хотите удалить скважину "{well.well_type}" уровня {well.level}? 
                      Это действие нельзя отменить. Ваш дневной доход уменьшится на {well.daily_income.toLocaleString()} ₽.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteWell(well.id, well.well_type)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Удалить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}