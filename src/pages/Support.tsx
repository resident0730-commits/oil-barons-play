import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, MessageSquare, Send, Clock, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
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

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    loadTickets();
  }, [user, navigate]);

  const loadTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
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
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user!.id,
          subject: subject.trim(),
          message: message.trim(),
          category
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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Назад
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Служба поддержки</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create New Ticket */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Создать заявку
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="category">Категория</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Общий вопрос</SelectItem>
                      <SelectItem value="technical">Техническая проблема</SelectItem>
                      <SelectItem value="billing">Вопросы оплаты</SelectItem>
                      <SelectItem value="account">Аккаунт</SelectItem>
                      <SelectItem value="feature">Предложение</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Тема обращения *</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Кратко опишите проблему или вопрос"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Подробное описание *</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Опишите проблему подробно. Укажите шаги для воспроизведения, если это техническая проблема."
                    rows={6}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
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
            <CardHeader>
              <CardTitle>Мои заявки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Загрузка заявок...
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>У вас пока нет заявок</p>
                    <p className="text-sm">Создайте первую заявку слева</p>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{ticket.subject}</h4>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(ticket.status)}
                          <span className="text-xs text-muted-foreground">
                            {getStatusText(ticket.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryText(ticket.category)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(ticket.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {ticket.message}
                      </p>
                      
                      {ticket.admin_response && (
                        <div className="mt-3 p-2 bg-green-50 border-l-4 border-green-400 rounded">
                          <p className="text-xs font-medium text-green-800 mb-1">
                            Ответ поддержки:
                          </p>
                          <p className="text-xs text-green-700">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;