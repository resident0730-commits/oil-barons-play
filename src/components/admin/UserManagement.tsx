import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { UserX, UserCheck, Search, Shield, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  user_id: string;
  nickname: string;
  balance: number;
  daily_income: number;
  is_banned: boolean;
  ban_reason?: string;
  banned_at?: string;
  created_at: string;
  user_roles?: { role: string }[] | null;
}

export function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [banReason, setBanReason] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // First get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast.error('Ошибка загрузки пользователей');
        return;
      }

      // Then get roles for each user
      const usersWithRoles = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.user_id);
          
          return {
            ...profile,
            user_roles: roles || []
          };
        })
      );

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (userId: string) => {
    if (!banReason.trim()) {
      toast.error('Укажите причину блокировки');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_banned: true,
          ban_reason: banReason,
          banned_at: new Date().toISOString(),
          banned_by: user?.id
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error banning user:', error);
        toast.error('Ошибка блокировки пользователя');
      } else {
        toast.success('Пользователь заблокирован');
        setBanReason('');
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Ошибка блокировки пользователя');
    }
  };

  const unbanUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_banned: false,
          ban_reason: null,
          banned_at: null,
          banned_by: null
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error unbanning user:', error);
        toast.error('Ошибка разблокировки пользователя');
      } else {
        toast.success('Пользователь разблокирован');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast.error('Ошибка разблокировки пользователя');
    }
  };

  const changeUserRole = async (userId: string, newRole: 'admin' | 'moderator' | 'user') => {
    try {
      // First, delete existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole
        });

      if (error) {
        console.error('Error changing user role:', error);
        toast.error('Ошибка изменения роли');
      } else {
        toast.success('Роль пользователя изменена');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error changing user role:', error);
      toast.error('Ошибка изменения роли');
    }
  };

  const filteredUsers = users.filter(user =>
    user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (userRoles?: { role: string }[] | null) => {
    const role = userRoles?.[0]?.role || 'user';
    const colors = {
      admin: 'bg-red-100 text-red-800',
      moderator: 'bg-yellow-100 text-yellow-800',
      user: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={colors[role as keyof typeof colors] || colors.user}>
        {role === 'admin' ? 'Админ' : role === 'moderator' ? 'Модератор' : 'Игрок'}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Управление пользователями</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление пользователями</CardTitle>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по никнейму..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Никнейм</TableHead>
              <TableHead>Баланс</TableHead>
              <TableHead>Доход/день</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата регистрации</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((userProfile) => (
              <TableRow key={userProfile.id}>
                <TableCell className="font-medium">{userProfile.nickname}</TableCell>
                <TableCell>${Number(userProfile.balance).toLocaleString()}</TableCell>
                <TableCell>${Number(userProfile.daily_income).toLocaleString()}</TableCell>
                <TableCell>{getRoleBadge(userProfile.user_roles)}</TableCell>
                <TableCell>
                  {userProfile.is_banned ? (
                    <Badge variant="destructive">Заблокирован</Badge>
                  ) : (
                    <Badge variant="default">Активен</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(userProfile.created_at).toLocaleDateString('ru-RU')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {!userProfile.is_banned ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setSelectedUser(userProfile)}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Заблокировать пользователя</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p>Вы уверены, что хотите заблокировать пользователя <strong>{userProfile.nickname}</strong>?</p>
                            <Textarea
                              placeholder="Причина блокировки..."
                              value={banReason}
                              onChange={(e) => setBanReason(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <Button
                                variant="destructive"
                                onClick={() => banUser(userProfile.user_id)}
                              >
                                Заблокировать
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="default" size="sm">
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Разблокировать пользователя</AlertDialogTitle>
                            <AlertDialogDescription>
                              Вы уверены, что хотите разблокировать пользователя {userProfile.nickname}?
                              {userProfile.ban_reason && (
                                <div className="mt-2 p-2 bg-muted rounded">
                                  <strong>Причина блокировки:</strong> {userProfile.ban_reason}
                                </div>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction onClick={() => unbanUser(userProfile.user_id)}>
                              Разблокировать
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Shield className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Изменить роль пользователя</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p>Изменить роль пользователя <strong>{userProfile.nickname}</strong>:</p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => changeUserRole(userProfile.user_id, 'user')}
                            >
                              <User className="h-4 w-4 mr-2" />
                              Игрок
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => changeUserRole(userProfile.user_id, 'moderator')}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Модератор
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => changeUserRole(userProfile.user_id, 'admin')}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Админ
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Пользователи не найдены
          </div>
        )}
      </CardContent>
    </Card>
  );
}