import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Fuel, ArrowLeft, User, Lock, Save } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, updatePassword, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nickname: user?.user_metadata?.nickname || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nickname.trim()) {
      toast({ variant: "destructive", title: "Ошибка", description: "Укажите никнейм" });
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ nickname: formData.nickname });
      toast({ title: "Успешно", description: "Профиль обновлён" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Ошибка", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword.length < 6) {
      toast({ variant: "destructive", title: "Ошибка", description: "Пароль должен быть не менее 6 символов" });
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Ошибка", description: "Пароли не совпадают" });
      return;
    }

    setLoading(true);
    try {
      await updatePassword(formData.newPassword);
      toast({ title: "Успешно", description: "Пароль изменён" });
      setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } catch (error: any) {
      toast({ variant: "destructive", title: "Ошибка", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад в игру
            </Link>
            <div className="flex items-center space-x-2">
              <Fuel className="h-6 w-6 text-primary" />
              <span className="font-semibold">Oil Tycoon</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Настройки профиля
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="nickname">Никнейм</Label>
                  <Input
                    id="nickname"
                    placeholder="Ваш никнейм в игре"
                    value={formData.nickname}
                    onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full gradient-primary shadow-primary"
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Сохранение..." : "Сохранить профиль"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-primary" />
                Изменение пароля
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div>
                  <Label htmlFor="newPassword">Новый пароль</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Минимум 6 символов"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Повторите новый пароль"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>
                <Separator />
                <Button 
                  type="submit" 
                  className="w-full"
                  variant="outline"
                  disabled={loading}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {loading ? "Изменение..." : "Изменить пароль"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;