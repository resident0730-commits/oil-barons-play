import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Trash2, Edit, Plus } from 'lucide-react';

interface BotPlayer {
  id: string;
  nickname: string;
  balance: number;
  daily_income: number;
  created_at: string;
  updated_at: string;
}

export function BotManager() {
  const [bots, setBots] = useState<BotPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBot, setEditingBot] = useState<BotPlayer | null>(null);
  const [newBot, setNewBot] = useState({
    nickname: '',
    balance: 0,
    daily_income: 0
  });

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      const { data, error } = await supabase
        .from('bot_players')
        .select('*')
        .order('balance', { ascending: false });

      if (error) throw error;
      setBots(data || []);
    } catch (error: any) {
      console.error('Error fetching bots:', error);
      toast.error('Ошибка загрузки ботов');
    } finally {
      setLoading(false);
    }
  };

  const createBot = async () => {
    if (!newBot.nickname.trim()) {
      toast.error('Введите имя бота');
      return;
    }

    try {
      const { error } = await supabase
        .from('bot_players')
        .insert([newBot]);

      if (error) throw error;

      toast.success('Бот создан успешно');
      setNewBot({ nickname: '', balance: 0, daily_income: 0 });
      fetchBots();
    } catch (error: any) {
      console.error('Error creating bot:', error);
      toast.error('Ошибка создания бота');
    }
  };

  const updateBot = async (bot: BotPlayer) => {
    try {
      const { error } = await supabase
        .from('bot_players')
        .update({
          nickname: bot.nickname,
          balance: bot.balance,
          daily_income: bot.daily_income,
          updated_at: new Date().toISOString()
        })
        .eq('id', bot.id);

      if (error) throw error;

      toast.success('Бот обновлен успешно');
      setEditingBot(null);
      fetchBots();
    } catch (error: any) {
      console.error('Error updating bot:', error);
      toast.error('Ошибка обновления бота');
    }
  };

  const deleteBot = async (botId: string, botName: string) => {
    try {
      const { error } = await supabase
        .from('bot_players')
        .delete()
        .eq('id', botId);

      if (error) throw error;

      toast.success(`Бот "${botName}" удален`);
      fetchBots();
    } catch (error: any) {
      console.error('Error deleting bot:', error);
      toast.error('Ошибка удаления бота');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Управление ботами</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Загрузка...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Управление ботами
        </CardTitle>
        <CardDescription>
          Управление демо-счетами, которые отображаются в рейтинге
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create New Bot */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold">Создать нового бота</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bot-nickname">Имя</Label>
              <Input
                id="bot-nickname"
                value={newBot.nickname}
                onChange={(e) => setNewBot({ ...newBot, nickname: e.target.value })}
                placeholder="Имя бота"
              />
            </div>
            <div>
              <Label htmlFor="bot-balance">Баланс</Label>
              <Input
                id="bot-balance"
                type="number"
                value={newBot.balance}
                onChange={(e) => setNewBot({ ...newBot, balance: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="bot-income">Дневной доход</Label>
              <Input
                id="bot-income"
                type="number"
                value={newBot.daily_income}
                onChange={(e) => setNewBot({ ...newBot, daily_income: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>
          <Button onClick={createBot} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Создать бота
          </Button>
        </div>

        {/* Bots List */}
        <div className="space-y-4">
          <h3 className="font-semibold">Список ботов ({bots.length})</h3>
          {bots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Нет созданных ботов
            </div>
          ) : (
            <div className="space-y-3">
              {bots.map((bot) => (
                <div key={bot.id} className="border rounded-lg p-4">
                  {editingBot?.id === bot.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Имя</Label>
                        <Input
                          value={editingBot.nickname}
                          onChange={(e) => setEditingBot({ ...editingBot, nickname: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Баланс</Label>
                        <Input
                          type="number"
                          value={editingBot.balance}
                          onChange={(e) => setEditingBot({ ...editingBot, balance: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Дневной доход</Label>
                        <Input
                          type="number"
                          value={editingBot.daily_income}
                          onChange={(e) => setEditingBot({ ...editingBot, daily_income: Number(e.target.value) })}
                        />
                      </div>
                      <div className="flex gap-2 md:col-span-3">
                        <Button onClick={() => updateBot(editingBot)} size="sm">
                          Сохранить
                        </Button>
                        <Button onClick={() => setEditingBot(null)} variant="outline" size="sm">
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{bot.nickname}</h4>
                        <p className="text-sm text-muted-foreground">
                          Баланс: {bot.balance.toLocaleString()} | 
                          Доход: {bot.daily_income.toLocaleString()}/день
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setEditingBot(bot)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Удалить бота</AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы уверены, что хотите удалить бота "{bot.nickname}"? 
                                Это действие нельзя отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteBot(bot.id, bot.nickname)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Удалить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}