import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, MessageSquare, Send, Clock, CheckCircle, AlertCircle, HelpCircle, Upload, X, Image } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  admin_response?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

const Support = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form data
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    loadTickets();
  }, [user, navigate]);

  const loadTickets = async () => {
    try {
      // Пробуем загрузить с attachments
      const { data: dataWithAttachments, error: attachmentsError } = await supabase
        .from('support_tickets')
        .select('*, attachments')
        .order('created_at', { ascending: false });

      if (attachmentsError && attachmentsError.message.includes('attachments')) {
        // Если поле attachments не существует, загружаем без него
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('support_tickets')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (fallbackError) throw fallbackError;
        
        // Добавляем пустой массив attachments к каждой заявке
        const ticketsWithAttachments = (fallbackData || []).map(ticket => ({ 
          ...ticket, 
          attachments: [] as string[] 
        }));
        
        setTickets(ticketsWithAttachments as SupportTicket[]);
      } else if (attachmentsError) {
        throw attachmentsError;
      } else {
        setTickets((dataWithAttachments as any) || []);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast({
        variant: 'destructive',
        title: 'Неверный формат',
        description: 'Можно прикреплять только изображения'
      });
    }
    
    setAttachments(prev => [...prev, ...imageFiles].slice(0, 5)); // Максимум 5 файлов
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const convertFilesToBase64 = async (files: File[]): Promise<string[]> => {
    const promises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    
    return Promise.all(promises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Заполните все обязательные поля'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let attachmentData: string[] = [];
      
      if (attachments.length > 0) {
        attachmentData = await convertFilesToBase64(attachments);
      }

      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user!.id,
          subject: subject.trim(),
          message: message.trim(),
          category,
          attachments: attachmentData.length > 0 ? attachmentData : null
        });

      if (error) throw error;

      toast({
        title: 'Заявка отправлена',
        description: 'Мы получили ваше обращение и ответим в ближайшее время'
      });

      // Reset form
      setSubject('');
      setMessage('');
      setCategory('general');
      setAttachments([]);
      
      // Reload tickets
      loadTickets();
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось отправить заявку. Попробуйте еще раз'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Открыта';
      case 'in_progress':
        return 'В работе';
      case 'resolved':
        return 'Решена';
      default:
        return status;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'general':
        return 'Общий вопрос';
      case 'technical':
        return 'Техническая проблема';
      case 'billing':
        return 'Вопросы оплаты';
      case 'balance_deposit':
        return 'Пополнение баланса';
      case 'account':
        return 'Аккаунт';
      case 'feature':
        return 'Предложение';
      default:
        return category;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-3 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Button variant="outline" asChild className="touch-target h-10 sm:h-11">
            <Link to="/dashboard">
              <ChevronLeft className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-base">Назад</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold">Служба поддержки</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Create New Ticket */}
          <Card className="h-fit">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Send className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Создать заявку
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="category" className="text-xs sm:text-sm">Категория</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-10 sm:h-11 touch-target text-xs sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balance_deposit">Пополнение баланса</SelectItem>
                      <SelectItem value="general">Общий вопрос</SelectItem>
                      <SelectItem value="technical">Техническая проблема</SelectItem>
                      <SelectItem value="billing">Вопросы оплаты</SelectItem>
                      <SelectItem value="account">Аккаунт</SelectItem>
                      <SelectItem value="feature">Предложение</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-xs sm:text-sm">Тема обращения *</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Кратко опишите проблему или вопрос"
                    className="h-10 sm:h-11 touch-target text-xs sm:text-base"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-xs sm:text-sm">Подробное описание *</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={category === 'balance_deposit' 
                      ? "Опишите проблему с пополнением: какую сумму пытались пополнить, какой способ оплаты использовали, на каком этапе возникла ошибка. При наличии - приложите скриншот ошибки."
                      : "Опишите проблему подробно. Укажите шаги для воспроизведения, если это техническая проблема."
                    }
                    rows={5}
                    className="text-xs sm:text-base resize-none"
                    required
                  />
                </div>

                {/* File Upload */}
                <div>
                  <Label className="text-xs sm:text-sm">Прикрепить скриншоты (до 5 изображений)</Label>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="h-10 sm:h-11 text-xs sm:text-sm file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    
                    {attachments.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                              <Image className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                              <span className="text-xs truncate flex-1">
                                {file.name}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAttachment(index)}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-destructive/20 flex-shrink-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 h-11 sm:h-12 touch-target text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Отправка...
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Отправить заявку
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* My Tickets */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Мои заявки</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground text-xs sm:text-base">
                    Загрузка заявок...
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm sm:text-base">У вас пока нет заявок</p>
                    <p className="text-xs sm:text-sm">Создайте первую заявку слева</p>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="border rounded-lg p-3 sm:p-4 space-y-2 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-xs sm:text-sm">{ticket.subject}</h4>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          {getStatusIcon(ticket.status)}
                          <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                            {getStatusText(ticket.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <Badge variant="outline" className="text-[10px] sm:text-xs">
                          {getCategoryText(ticket.category)}
                        </Badge>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                          {new Date(ticket.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      
                      <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">
                        {ticket.message}
                      </p>
                      
                      
                      {ticket.attachments && ticket.attachments.length > 0 && (
                        <div className="mt-2">
                          <p className="text-[10px] sm:text-xs font-medium mb-1">Прикрепленные файлы:</p>
                          <div className="flex flex-wrap gap-1">
                            {ticket.attachments.map((attachment, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={attachment}
                                  alt={`Attachment ${index + 1}`}
                                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded border cursor-pointer hover:opacity-80 touch-target"
                                  onClick={() => window.open(attachment, '_blank')}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {ticket.admin_response && (
                        <div className="mt-3 p-2 bg-green-50 dark:bg-green-950/20 border-l-4 border-green-400 rounded">
                          <p className="text-[10px] sm:text-xs font-medium text-green-800 dark:text-green-400 mb-1">
                            Ответ поддержки:
                          </p>
                          <p className="text-[10px] sm:text-xs text-green-700 dark:text-green-300">
                            {ticket.admin_response}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Часто задаваемые вопросы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Раздел "Пополнение баланса" */}
              <Card className="border-l-4 border-l-primary bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Проблемы с пополнением баланса
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Если оплата не прошла:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Проверьте, что средства списались с карты</li>
                      <li>Подождите до 10 минут - иногда зачисление происходит с задержкой</li>
                      <li>Обязательно сохраните скриншот успешной оплаты</li>
                      <li>Создайте заявку в категории "Пополнение баланса" с приложенным скриншотом</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Что указать в заявке:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Точную сумму пополнения</li>
                      <li>Способ оплаты (карта, электронный кошелек и т.д.)</li>
                      <li>Время и дату операции</li>
                      <li>Скриншот подтверждения оплаты</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Как пополнить баланс?</h4>
                  <p className="text-sm text-muted-foreground">
                    Перейдите в раздел пополнения баланса и выберите удобный способ оплаты. Средства зачисляются мгновенно.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Как работают бустеры?</h4>
                  <p className="text-sm text-muted-foreground">
                    Бустеры увеличивают доходность ваших скважин. Некоторые действуют постоянно, другие - временно.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Что такое оффлайн доход?</h4>
                  <p className="text-sm text-muted-foreground">
                    Ваши скважины продолжают работать даже когда вы не в игре. Доход начисляется до 24 часов оффлайн.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Как улучшить скважины?</h4>
                  <p className="text-sm text-muted-foreground">
                    Нажмите кнопку "Улучшить" у нужной скважины. Каждое улучшение увеличивает доходность.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;