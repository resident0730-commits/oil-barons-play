import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, Search, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Profile {
  user_id: string;
  nickname: string;
  balance: number;
}

export function MoneyTransfer() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [searchResults, setSearchResults] = useState<Profile[]>([]);

  // Search for users
  const searchUsers = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, nickname, balance')
        .ilike('nickname', `%${term}%`)
        .neq('user_id', user?.id) // Exclude self
        .eq('is_banned', false)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error: any) {
      console.error('Error searching users:', error);
      toast({
        title: "Ошибка поиска",
        description: "Не удалось найти пользователей",
        variant: "destructive",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      searchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(debounceSearch);
  }, [searchTerm]);

  const handleTransfer = async () => {
    if (!user || !selectedUser) return;
    
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast({
        title: "Ошибка",
        description: "Введите корректную сумму для перевода",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Call the transfer function
      const { data, error } = await supabase.rpc('transfer_money', {
        p_from_user_id: user.id,
        p_to_user_id: selectedUser.user_id,
        p_amount: transferAmount,
        p_description: description || `Перевод от ${user.email} пользователю ${selectedUser.nickname}`,
        p_admin_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Перевод выполнен",
        description: `Успешно переведено ${transferAmount.toLocaleString()} ₽ пользователю ${selectedUser.nickname}`,
      });

      // Reset form
      setAmount('');
      setDescription('');
      setSelectedUser(null);
      setSearchTerm('');
      setSearchResults([]);
      setOpen(false);
    } catch (error: any) {
      console.error('Error transferring money:', error);
      toast({
        title: "Ошибка перевода",
        description: error.message || "Не удалось выполнить перевод",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          Перевести деньги
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Перевод денег игроку
          </DialogTitle>
          <DialogDescription>
            Переведите деньги любому игроку в системе
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!selectedUser ? (
            <div>
              <Label htmlFor="search">Поиск игрока</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Введите никнейм игрока..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {searchLoading && (
                <p className="text-sm text-muted-foreground mt-2">Поиск...</p>
              )}
              
              {searchResults.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                  {searchResults.map((profile) => (
                    <Button
                      key={profile.user_id}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => {
                        setSelectedUser(profile);
                        setSearchTerm('');
                        setSearchResults([]);
                      }}
                    >
                      <div>
                        <div className="font-medium">{profile.nickname}</div>
                        <div className="text-sm text-muted-foreground">
                          Баланс: {profile.balance.toLocaleString()} ₽
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-secondary/20 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{selectedUser.nickname}</h4>
                  <p className="text-sm text-muted-foreground">
                    Баланс: {selectedUser.balance.toLocaleString()} ₽
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                >
                  Изменить
                </Button>
              </div>
            </div>
          )}

          {selectedUser && (
            <>
              <div>
                <Label htmlFor="amount">Сумма перевода *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Введите сумму в рублях"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="description">Комментарий</Label>
                <Textarea
                  id="description"
                  placeholder="Причина перевода (необязательно)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          {selectedUser && (
            <Button onClick={handleTransfer} disabled={loading || !amount}>
              {loading ? "Перевод..." : "Перевести"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}