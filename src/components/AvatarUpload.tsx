import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarUpdate: (url: string) => void;
}

export const AvatarUpload = ({ currentAvatarUrl, onAvatarUpdate }: AvatarUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Выберите изображение для загрузки");
      }

      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error("Пожалуйста, выберите файл изображения");
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("Размер файла не должен превышать 2MB");
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Math.random()}.${fileExt}`;
      const filePath = fileName;

      // Upload image to storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl } as any)
        .eq('user_id', user?.id);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      onAvatarUpdate(publicUrl);

      toast({
        title: "Аватарка обновлена",
        description: "Ваша аватарка успешно загружена",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка загрузки",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Get initials for fallback
  const getInitials = () => {
    const nickname = user?.user_metadata?.nickname || user?.email || "User";
    return nickname.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-xl">
          <AvatarImage src={avatarUrl} alt="Avatar" />
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-2xl font-bold">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        <Button
          size="icon"
          variant="default"
          className="absolute bottom-0 right-0 h-10 w-10 rounded-full shadow-lg gradient-primary"
          onClick={triggerFileInput}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={uploadAvatar}
        className="hidden"
      />

      <Button
        variant="outline"
        size="sm"
        onClick={triggerFileInput}
        disabled={uploading}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        {uploading ? "Загрузка..." : "Выбрать фото"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        JPG, PNG или GIF. Максимум 2MB.
      </p>
    </div>
  );
};
