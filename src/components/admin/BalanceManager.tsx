import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Wallet, Plus, Search } from 'lucide-react';

export const BalanceManager = () => {
  const [nickname, setNickname] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const { toast } = useToast();

  const searchPlayers = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname, balance, daily_income')
        .ilike('nickname', `%${searchTerm}%`)
        .limit(5);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleAddBalance = async () => {
    if (!nickname.trim() || !amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Укажите корректный никнейм и положительную сумму"
      });
      return;
    }

    try {
      setLoading(true);
      const amountToAdd = parseFloat(amount);

      // Find user by nickname
      const { data: userProfile, error: findError } = await supabase
        .from('profiles')
        .select('*')
        .eq('nickname', nickname.trim())
        .single();

      if (findError || !userProfile) {
        toast({
          variant: "destructive",
          title: "Пользователь не найден",
          description: "Проверьте правильность никнейма"
        });
        return;
      }

      // Add balance
      const newBalance = Number(userProfile.balance) + amountToAdd;
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('nickname', nickname.trim());

      if (updateError) throw updateError;

      toast({
        title: "Баланс пополнен!",
        description: `Добавлено ${amountToAdd.toLocaleString()} ₽ пользователю ${nickname}. Новый баланс: ${newBalance.toLocaleString()} ₽`
      });

      setNickname('');
      setAmount('');
      setSearchResults([]);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка пополнения",
        description: error.message || "Попробуйте позже"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = (value: string) => {
    setAmount(value);
  };

  const selectPlayer = (playerNickname: string) => {
    setNickname(playerNickname);
    setSearchResults([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Пополнение баланса игроков
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nickname">Никнейм игрока</Label>
          <div className="relative">
            <Input
              id="nickname"
              type="text"
              placeholder="Введите никнейм для поиска..."
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                searchPlayers(e.target.value);
              }}
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-card border rounded-md shadow-md max-h-40 overflow-y-auto">
              {searchResults.map((player, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                  onClick={() => selectPlayer(player.nickname)}
                >
                  <div className="font-medium">{player.nickname}</div>
                  <div className="text-sm text-muted-foreground">
                    Баланс: {Number(player.balance).toLocaleString()} ₽ | 
                    Доход: {Number(player.daily_income).toLocaleString()} ₽/день
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Сумма для пополнения (₽)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Введите сумму..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
          />
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => handleQuickAmount("1000")}
            className="flex-1"
          >
            1,000 ₽
          </Button>
          <Button
            variant="outline"
            onClick={() => handleQuickAmount("10000")}
            className="flex-1"
          >
            10,000 ₽
          </Button>
          <Button
            variant="outline"
            onClick={() => handleQuickAmount("100000")}
            className="flex-1"
          >
            100,000 ₽
          </Button>
        </div>

        <Button
          onClick={handleAddBalance}
          disabled={loading || !nickname.trim() || !amount}
          className="w-full gradient-gold shadow-gold"
        >
          <Plus className="h-4 w-4 mr-2" />
          {loading ? "Пополняем..." : "Пополнить баланс"}
        </Button>

        <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
          <strong>Инструкция:</strong>
          <br />
          1. Начните вводить никнейм игрока для поиска
          <br />
          2. Выберите игрока из результатов поиска
          <br />
          3. Укажите сумму пополнения
          <br />
          4. Нажмите "Пополнить баланс"
        </div>
      </CardContent>
    </Card>
  );
};