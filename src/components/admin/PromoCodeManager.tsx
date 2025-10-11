import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ticket, Plus, Trash2, Power, PowerOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface PromoCode {
  id: string;
  code: string;
  bonus_amount: number;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export function PromoCodeManager() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [bonusAmount, setBonusAmount] = useState("500");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading promo codes:', error);
      return;
    }

    setPromoCodes(data || []);
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCode(code);
  };

  const createPromoCode = async () => {
    if (!newCode.trim() || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('promo_codes')
        .insert({
          code: newCode.toUpperCase().trim(),
          bonus_amount: parseFloat(bonusAmount),
          max_uses: maxUses ? parseInt(maxUses) : null,
          expires_at: expiresAt || null,
          created_by: user.id,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Промокод создан",
        description: `Промокод ${newCode} успешно создан`,
      });

      setNewCode("");
      setBonusAmount("500");
      setMaxUses("");
      setExpiresAt("");
      loadPromoCodes();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePromoCode = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('promo_codes')
      .update({ is_active: !currentState })
      .eq('id', id);

    if (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус промокода",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Статус изменен",
      description: `Промокод ${!currentState ? 'активирован' : 'деактивирован'}`,
    });

    loadPromoCodes();
  };

  const deletePromoCode = async (id: string) => {
    if (!confirm('Удалить промокод?')) return;

    const { error } = await supabase
      .from('promo_codes')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить промокод",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Промокод удален",
      description: "Промокод успешно удален",
    });

    loadPromoCodes();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Управление промокодами
        </CardTitle>
        <CardDescription>
          Создавайте промокоды на +500₽ к пополнению
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Создание промокода */}
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="font-semibold">Создать новый промокод</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="code">Код промокода</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="code"
                  placeholder="PROMO2025"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                />
                <Button onClick={generateRandomCode} variant="outline">
                  Генерировать
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="bonus">Сумма бонуса (₽)</Label>
              <Input
                id="bonus"
                type="number"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="maxUses">Макс. использований (опционально)</Label>
              <Input
                id="maxUses"
                type="number"
                placeholder="Без ограничений"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="expires">Дата истечения (опционально)</Label>
              <Input
                id="expires"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <Button 
            onClick={createPromoCode} 
            disabled={!newCode.trim() || loading}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Создать промокод
          </Button>
        </div>

        {/* Список промокодов */}
        <div>
          <h3 className="font-semibold mb-4">Существующие промокоды</h3>
          
          {promoCodes.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Промокодов пока нет
            </p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Код</TableHead>
                    <TableHead>Бонус</TableHead>
                    <TableHead>Использовано</TableHead>
                    <TableHead>Истекает</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoCodes.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell className="font-mono font-bold">{promo.code}</TableCell>
                      <TableCell>{promo.bonus_amount}₽</TableCell>
                      <TableCell>
                        {promo.current_uses}
                        {promo.max_uses && ` / ${promo.max_uses}`}
                      </TableCell>
                      <TableCell>
                        {promo.expires_at 
                          ? new Date(promo.expires_at).toLocaleDateString()
                          : '—'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={promo.is_active ? "default" : "secondary"}>
                          {promo.is_active ? "Активен" : "Неактивен"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => togglePromoCode(promo.id, promo.is_active)}
                          >
                            {promo.is_active ? (
                              <PowerOff className="h-4 w-4" />
                            ) : (
                              <Power className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deletePromoCode(promo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
