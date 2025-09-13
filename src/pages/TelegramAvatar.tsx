import telegramAvatar from "@/assets/telegram-avatar.png";

export default function TelegramAvatar() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-6">Аватарка для Telegram канала</h1>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <img 
            src={telegramAvatar} 
            alt="Telegram Avatar"
            className="w-64 h-64 mx-auto mb-4 rounded-full border-4 border-primary"
          />
          <p className="text-muted-foreground mb-4">
            Нажмите правой кнопкой мыши на изображение и выберите "Сохранить изображение как..."
          </p>
          <a 
            href={telegramAvatar}
            download="telegram-avatar.png"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Скачать изображение
          </a>
        </div>
      </div>
    </div>
  );
}