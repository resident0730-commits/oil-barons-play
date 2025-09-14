import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Search, Zap, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface UserBooster {
  id: string;
  user_id: string;
  booster_type: string;
  level: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    nickname: string;
  };
}

export const BoosterManager = () => {
  const { toast } = useToast();
  const [boosters, setBoosters] = useState<UserBooster[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [boosterTypeFilter, setBoosterTypeFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState('');

  const boosterTypes = [
    { id: 'worker_crew', name: 'Квалифицированная бригада' },
    { id: 'geological_survey', name: 'Геологические исследования' },
    { id: 'advanced_equipment', name: 'Современное оборудование' },
    { id: 'turbo_boost', name: 'Турбо режим' },
    { id: 'automation', name: 'Автоматизация' }
  ];

  const fetchBoosters = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('user_boosters')
        .select(`
          id,
          user_id,
          booster_type,
          level,
          expires_at,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (boosterTypeFilter !== 'all') {
        query = query.eq('booster_type', boosterTypeFilter);
      }

      const { data: boostersData, error } = await query;
      if (error) throw error;

      // Получаем информацию о пользователях отдельно
      const userIds = [...new Set(boostersData?.map(b => b.user_id) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, nickname')
        .in('user_id', userIds);

      // Объединяем данные
      const boostersWithProfiles = (boostersData || []).map(booster => ({
        ...booster,
        profiles: profilesData?.find(p => p.user_id === booster.user_id) || { nickname: 'Неизвестный' }
      }));

      setBoosters(boostersWithProfiles);
    } catch (error) {
      console.error('Error fetching boosters:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список бустеров",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteBooster = async (boosterId: string, userNickname: string) => {
    try {
      const { error } = await supabase
        .from('user_boosters')
        .delete()
        .eq('id', boosterId);

      if (error) throw error;

      // Пересчитываем доходы всех затронутых пользователей
      const { data: userData } = await supabase
        .from('user_boosters')
        .select('user_id')
        .eq('id', boosterId)
        .single();

      if (userData) {
        // Здесь можно добавить логику пересчета дохода пользователя
        // Но для простоты оставим как есть
      }

      toast({
        title: "Бустер удален",
        description: `Бустер пользователя ${userNickname} успешно удален`
      });

      fetchBoosters();
    } catch (error) {
      console.error('Error deleting booster:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить бустер",
        variant: "destructive"
      });
    }
  };

  const deleteAllUserBoosters = async (userId: string, userNickname: string) => {
    try {
      const { error } = await supabase
        .from('user_boosters')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Все бустеры удалены",
        description: `Все бустеры пользователя ${userNickname} успешно удалены`
      });

      fetchBoosters();
    } catch (error) {
      console.error('Error deleting all boosters:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить бустеры",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchBoosters();
  }, [boosterTypeFilter]);

  const filteredBoosters = boosters.filter(booster => {
    const matchesSearch = !searchTerm || 
      booster.profiles?.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booster.booster_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUser = !selectedUser || booster.user_id === selectedUser;
    
    return matchesSearch && matchesUser;
  });

  const getBoosterName = (type: string) => {
    return boosterTypes.find(bt => bt.id === type)?.name || type;
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) <= new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  // Группировка бустеров по пользователям
  const boostersByUser = useMemo(() => {
    const grouped = filteredBoosters.reduce((acc, booster) => {
      const userId = booster.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          nickname: booster.profiles?.nickname || 'Неизвестный',
          boosters: []
        };
      }
      acc[userId].boosters.push(booster);
      return acc;
    }, {} as Record<string, { nickname: string; boosters: UserBooster[] }>);
    
    return Object.entries(grouped);
  }, [filteredBoosters]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Управление бустерами
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Фильтры */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">Поиск по пользователю</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Введите никнейм..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label>Тип бустера</Label>
            <Select value={boosterTypeFilter} onValueChange={setBoosterTypeFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                {boosterTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={fetchBoosters} disabled={loading} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Обновить
            </Button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{boosters.length}</div>
              <p className="text-sm text-muted-foreground">Всего бустеров</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {new Set(boosters.map(b => b.user_id)).size}
              </div>
              <p className="text-sm text-muted-foreground">Пользователей с бустерами</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {boosters.filter(b => isExpired(b.expires_at)).length}
              </div>
              <p className="text-sm text-muted-foreground">Истекших бустеров</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {boosters.filter(b => !b.expires_at || !isExpired(b.expires_at)).length}
              </div>
              <p className="text-sm text-muted-foreground">Активных бустеров</p>
            </CardContent>
          </Card>
        </div>

        {/* Список бустеров по пользователям */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p>Загрузка бустеров...</p>
            </div>
          ) : boostersByUser.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Бустеры не найдены</p>
            </div>
          ) : (
            boostersByUser.map(([userId, userData]) => (
              <Card key={userId} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{userData.nickname}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {userData.boosters.length} бустеров
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить все
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Удалить все бустеры?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Вы действительно хотите удалить все бустеры пользователя {userData.nickname}? 
                            Это действие нельзя отменить.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteAllUserBoosters(userId, userData.nickname)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Удалить все
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userData.boosters.map((booster) => (
                      <div
                        key={booster.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {getBoosterName(booster.booster_type)}
                            </span>
                            <Badge variant="outline">
                              Уровень {booster.level}
                            </Badge>
                            {booster.expires_at && (
                              <Badge variant={isExpired(booster.expires_at) ? "destructive" : "secondary"}>
                                {isExpired(booster.expires_at) ? "Истек" : "Временный"}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Создан: {formatDate(booster.created_at)}</p>
                            {booster.expires_at && (
                              <p>
                                Истекает: {formatDate(booster.expires_at)}
                                {isExpired(booster.expires_at) && " (истек)"}
                              </p>
                            )}
                          </div>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Удалить бустер?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы действительно хотите удалить бустер "{getBoosterName(booster.booster_type)}" 
                                пользователя {userData.nickname}? Это действие нельзя отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteBooster(booster.id, userData.nickname)}
                                className="bg-destructive hover:bg-destructive/90"
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};