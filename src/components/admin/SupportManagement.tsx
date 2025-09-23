import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Clock, CheckCircle, AlertCircle, HelpCircle, Send, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  admin_response?: string;
  attachments?: string[];
  responded_by?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  profiles?: {
    nickname: string;
  } | null;
}

export const SupportManagement = () => {
  const { toast } = useToast();
  
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadTickets();
    
    // Real-time updates
    const channel = supabase
      .channel('support-tickets-admin')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'support_tickets'
      }, () => {
        loadTickets();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadTickets = async () => {
    try {
      // Загружаем заявки с attachments если поле существует
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          id,
          user_id,
          subject,
          message,
          category,
          status,
          priority,
          admin_response,
          attachments,
          responded_by,
          created_at,
          updated_at,
          resolved_at
        `)
        .order('created_at', { ascending: false });

      // Если поле attachments не существует, загружаем без него
      if (error && error.message.includes('attachments')) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('support_tickets')
          .select(`
            id,
            user_id,
            subject,
            message,
            category,
            status,
            priority,
            admin_response,
            responded_by,
            created_at,
            updated_at,
            resolved_at
          `)
          .order('created_at', { ascending: false });
          
        if (fallbackError) throw fallbackError;
        
        // Добавляем пустой attachments к каждой заявке
        const ticketsWithProfiles = await Promise.all(
          (fallbackData || []).map(async (ticket) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('nickname')
              .eq('user_id', ticket.user_id)
              .single();
            
            return {
              ...ticket,
              attachments: [] as string[],
              profiles: profile
            };
          })
        );
        
        setTickets(ticketsWithProfiles);
        return;
      }

      if (error) throw error;
      
      // Fetch profiles separately 
      const ticketsWithProfiles = await Promise.all(
        (data || []).map(async (ticket: any) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('nickname')
            .eq('user_id', ticket.user_id)
            .single();
          
          return {
            ...ticket,
            profiles: profile
          };
        })
      );
      
      setTickets(ticketsWithProfiles);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось загрузить заявки'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async () => {
    if (!selectedTicket || !response.trim()) return;

    setIsResponding(true);

    try {
      const updateData: any = {
        admin_response: response.trim(),
        updated_at: new Date().toISOString()
      };

      if (newStatus) {
        updateData.status = newStatus;
        if (newStatus === 'resolved') {
          updateData.resolved_at = new Date().toISOString();
        }
      }

      const { error } = await supabase
        .from('support_tickets')
        .update(updateData)
        .eq('id', selectedTicket.id);

      if (error) throw error;

      toast({
        title: 'Ответ отправлен',
        description: 'Пользователь получит уведомление о вашем ответе'
      });

      setResponse('');
      setNewStatus('');
      setSelectedTicket(null);
      loadTickets();
    } catch (error) {
      console.error('Error responding to ticket:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось отправить ответ'
      });
    } finally {
      setIsResponding(false);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredTickets = tickets.filter(ticket => 
    filterStatus === 'all' || ticket.status === filterStatus
  );

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p>Загрузка заявок...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Всего заявок</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.open}</div>
            <div className="text-sm text-muted-foreground">Открытых</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-muted-foreground">В работе</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-sm text-muted-foreground">Решенных</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Управление заявками поддержки
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Label htmlFor="filter">Фильтр по статусу:</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все заявки</SelectItem>
                <SelectItem value="open">Открытые</SelectItem>
                <SelectItem value="in_progress">В работе</SelectItem>
                <SelectItem value="resolved">Решенные</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Заявок не найдено</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{ticket.subject}</h4>
                        {getStatusIcon(ticket.status)}
                        <span className="text-sm text-muted-foreground">
                          {getStatusText(ticket.status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryText(ticket.category)}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(ticket.priority || 'low')}`}>
                          {ticket.priority || 'low'}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          {ticket.profiles?.nickname || 'Неизвестный пользователь'}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(ticket.created_at).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {ticket.message}
                      </p>
                      
                      {/* Отображение прикрепленных файлов */}
                      {ticket.attachments && ticket.attachments.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium mb-1">Прикрепленные файлы:</p>
                          <div className="flex flex-wrap gap-1">
                            {ticket.attachments.map((attachment: string, index: number) => (
                              <div key={index} className="relative group">
                                <img
                                  src={attachment}
                                  alt={`Attachment ${index + 1}`}
                                  className="w-12 h-12 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => window.open(attachment, '_blank')}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {ticket.admin_response && (
                        <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 rounded">
                          <p className="text-xs font-medium text-blue-800 mb-1">
                            Ваш ответ:
                          </p>
                          <p className="text-xs text-blue-700">
                            {ticket.admin_response}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setNewStatus(ticket.status);
                          }}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Ответить
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Ответ на заявку #{ticket.id.slice(0, 8)}</DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="bg-muted p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">
                                {ticket.profiles?.nickname || 'Неизвестный пользователь'}
                              </span>
                              <Badge variant="outline">{getCategoryText(ticket.category)}</Badge>
                            </div>
                            <h4 className="font-medium mb-2">{ticket.subject}</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {ticket.message}
                            </p>
                            
                            {/* Отображение прикрепленных изображений в диалоге */}
                            {ticket.attachments && ticket.attachments.length > 0 && (
                              <div className="mt-3">
                                <h5 className="text-sm font-medium mb-2">Прикрепленные изображения:</h5>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {ticket.attachments.map((attachment: string, index: number) => (
                                    <div key={index} className="relative group">
                                      <img
                                        src={attachment}
                                        alt={`Attachment ${index + 1}`}
                                        className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => window.open(attachment, '_blank')}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="status">Изменить статус</Label>
                            <Select value={newStatus} onValueChange={setNewStatus}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Открыта</SelectItem>
                                <SelectItem value="in_progress">В работе</SelectItem>
                                <SelectItem value="resolved">Решена</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="response">Ответ пользователю</Label>
                            <Textarea
                              id="response"
                              value={response}
                              onChange={(e) => setResponse(e.target.value)}
                              placeholder="Введите ответ пользователю..."
                              rows={4}
                            />
                          </div>
                          
                          <Button
                            onClick={handleRespond}
                            disabled={isResponding || !response.trim()}
                            className="w-full"
                          >
                            {isResponding ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Отправка...
                              </div>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Отправить ответ
                              </>
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};