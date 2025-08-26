import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  lastMessage?: string;
  time?: string;
  unread?: number;
}

interface Message {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'auth' | 'messenger'>('auth');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loginData, setLoginData] = useState({ name: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', password: '', confirmPassword: '' });
  const [currentUser, setCurrentUser] = useState<string>('Вы');
  const [searchQuery, setSearchQuery] = useState('');

  const [chats, setChats] = useState<User[]>([
    { id: '1', name: 'Анна Петрова', avatar: '/placeholder.svg', status: 'online', lastMessage: 'Привет! Как дела?', time: '14:30', unread: 2 },
    { id: '2', name: 'Команда Разработки', avatar: '/placeholder.svg', status: 'online', lastMessage: 'Новые обновления готовы', time: '13:45', unread: 1 },
    { id: '3', name: 'Михаил Соколов', avatar: '/placeholder.svg', status: 'offline', lastMessage: 'Увидимся завтра', time: '12:20' },
    { id: '4', name: 'Мария Иванова', avatar: '/placeholder.svg', status: 'online', lastMessage: 'Спасибо за помощь!', time: '11:15' },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', chatId: '1', sender: 'Анна Петрова', content: 'Привет! Как дела?', time: '14:28', isOwn: false },
    { id: '2', chatId: '1', sender: 'Вы', content: 'Привет! Всё отлично, спасибо! А у тебя как?', time: '14:29', isOwn: true },
    { id: '3', chatId: '1', sender: 'Анна Петрова', content: 'Тоже хорошо! Работаю над новым проектом', time: '14:30', isOwn: false },
    { id: '4', chatId: '1', sender: 'Вы', content: 'Звучит интересно! Расскажешь подробнее?', time: '14:31', isOwn: true },
    
    { id: '5', chatId: '2', sender: 'Команда Разработки', content: 'Добро пожаловать в команду!', time: '13:40', isOwn: false },
    { id: '6', chatId: '2', sender: 'Вы', content: 'Спасибо! Рад присоединиться', time: '13:41', isOwn: true },
    { id: '7', chatId: '2', sender: 'Команда Разработки', content: 'Новые обновления готовы для тестирования', time: '13:45', isOwn: false },
    
    { id: '8', chatId: '3', sender: 'Михаил Соколов', content: 'Встречаемся завтра в 10:00?', time: '12:15', isOwn: false },
    { id: '9', chatId: '3', sender: 'Вы', content: 'Конечно! Буду готов', time: '12:18', isOwn: true },
    { id: '10', chatId: '3', sender: 'Михаил Соколов', content: 'Отлично! Увидимся завтра', time: '12:20', isOwn: false },
    
    { id: '11', chatId: '4', sender: 'Мария Иванова', content: 'Помогите с проектом, пожалуйста', time: '11:10', isOwn: false },
    { id: '12', chatId: '4', sender: 'Вы', content: 'Конечно! Что именно нужно?', time: '11:12', isOwn: true },
    { id: '13', chatId: '4', sender: 'Мария Иванова', content: 'Спасибо за помощь!', time: '11:15', isOwn: false },
  ]);

  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  const handleAuth = () => {
    const username = authMode === 'login' ? loginData.name : registerData.name;
    if (username.trim()) {
      setCurrentUser(username);
      setCurrentView('messenger');
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      const newMsg: Message = {
        id: Date.now().toString(),
        chatId: selectedChat,
        sender: currentUser,
        content: newMessage,
        time: getCurrentTime(),
        isOwn: true
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      
      // Обновляем последнее сообщение в списке чатов
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat 
          ? { ...chat, lastMessage: newMessage, time: getCurrentTime() }
          : chat
      ));

      // Эмулируем ответ собеседника через 2-5 секунд
      if (selectedChat) {
        const currentChatUser = chats.find(c => c.id === selectedChat);
        if (currentChatUser) {
          setTypingUsers(prev => new Set(prev).add(currentChatUser.name));
          
          setTimeout(() => {
            setTypingUsers(prev => {
              const newSet = new Set(prev);
              newSet.delete(currentChatUser.name);
              return newSet;
            });

            const responses = [
              'Понятно!',
              'Интересно, расскажи подробнее',
              'Согласен с тобой',
              'Хорошая идея!',
              'Давай встретимся и обсудим',
              'Спасибо за информацию',
              'Буду рад помочь',
              'Отлично!',
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const responseMsg: Message = {
              id: (Date.now() + 1).toString(),
              chatId: selectedChat,
              sender: currentChatUser.name,
              content: randomResponse,
              time: getCurrentTime(),
              isOwn: false
            };
            
            setMessages(prev => [...prev, responseMsg]);
            setChats(prev => prev.map(chat => 
              chat.id === selectedChat 
                ? { ...chat, lastMessage: randomResponse, time: getCurrentTime() }
                : chat
            ));
          }, Math.random() * 3000 + 2000);
        }
      }
    }
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    // Сбрасываем непрочитанные сообщения
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, unread: 0 } : chat
    ));
  };

  const getCurrentChatMessages = () => {
    return messages.filter(msg => msg.chatId === selectedChat);
  };

  const getFilteredChats = () => {
    if (!searchQuery.trim()) return chats;
    return chats.filter(chat => 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getCurrentChat = () => {
    return chats.find(chat => chat.id === selectedChat);
  };

  // Эмуляция получения новых сообщений
  useEffect(() => {
    if (currentView === 'messenger') {
      const interval = setInterval(() => {
        // Случайно добавляем новые сообщения от других пользователей
        if (Math.random() > 0.95) { // 5% вероятность каждые 3 секунды
          const availableChats = chats.filter(chat => chat.id !== selectedChat);
          if (availableChats.length > 0) {
            const randomChat = availableChats[Math.floor(Math.random() * availableChats.length)];
            const randomMessages = [
              'Как дела?',
              'Не забудь про встречу',
              'Отправил файлы',
              'Всё готово!',
              'Увидимся позже',
            ];
            
            const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
            const newMsg: Message = {
              id: Date.now().toString(),
              chatId: randomChat.id,
              sender: randomChat.name,
              content: randomMessage,
              time: getCurrentTime(),
              isOwn: false
            };
            
            setMessages(prev => [...prev, newMsg]);
            setChats(prev => prev.map(chat => 
              chat.id === randomChat.id 
                ? { 
                    ...chat, 
                    lastMessage: randomMessage, 
                    time: getCurrentTime(),
                    unread: (chat.unread || 0) + 1
                  }
                : chat
            ));
          }
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [currentView, chats, selectedChat]);

  if (currentView === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
              <Icon name="MessageCircle" className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">SecureChat</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Безопасный мессенджер без номера телефона
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'register')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <Input
                    placeholder="Имя пользователя"
                    value={loginData.name}
                    onChange={(e) => setLoginData({...loginData, name: e.target.value})}
                    onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  />
                  <Input
                    type="password"
                    placeholder="Пароль"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  />
                </div>
                <Button 
                  onClick={handleAuth} 
                  className="w-full" 
                  size="lg"
                  disabled={!loginData.name.trim()}
                >
                  Войти
                </Button>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <Input
                    placeholder="Имя пользователя"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                  />
                  <Input
                    type="password"
                    placeholder="Пароль"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  />
                  <Input
                    type="password"
                    placeholder="Подтверждение пароля"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  />
                </div>
                <Button 
                  onClick={handleAuth} 
                  className="w-full" 
                  size="lg"
                  disabled={!registerData.name.trim() || registerData.password !== registerData.confirmPassword}
                >
                  Создать аккаунт
                </Button>
              </TabsContent>
            </Tabs>
            
            <div className="text-center text-xs text-muted-foreground">
              🔒 End-to-end шифрование • 🚀 Без номера телефона
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar with chats */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Чаты</h1>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Icon name="Search" className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="Plus" className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Input 
              placeholder="Поиск чатов..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Icon name="Search" className="h-4 w-4 absolute left-2 top-3 text-muted-foreground" />
          </div>
        </div>
        
        {/* Chat list */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {getFilteredChats().map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-accent ${
                  selectedChat === chat.id ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback>{chat.name[0]}</AvatarFallback>
                    </Avatar>
                    {chat.status === 'online' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{chat.name}</p>
                      <span className="text-xs text-muted-foreground">{chat.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {typingUsers.has(chat.name) ? (
                        <span className="text-blue-600 italic">печатает...</span>
                      ) : (
                        chat.lastMessage
                      )}
                    </p>
                  </div>
                  
                  {chat.unread && chat.unread > 0 && (
                    <Badge className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                      {chat.unread}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Profile section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{currentUser[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{currentUser}</p>
              <p className="text-xs text-green-600">В сети</p>
            </div>
            <Button variant="ghost" size="sm">
              <Icon name="Settings" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{getCurrentChat()?.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{getCurrentChat()?.name}</h2>
                  <p className={`text-sm ${getCurrentChat()?.status === 'online' ? 'text-green-600' : 'text-gray-500'}`}>
                    {typingUsers.has(getCurrentChat()?.name || '') ? 'печатает...' : getCurrentChat()?.status === 'online' ? 'в сети' : 'был(а) недавно'}
                  </p>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Icon name="Phone" className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="Video" className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="MoreHorizontal" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {getCurrentChatMessages().map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Message input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Icon name="Paperclip" className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Напишите сообщение..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1"
                  >
                    <Icon name="Smile" className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Icon name="Send" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div className="max-w-md animate-fade-in">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="MessageCircle" className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Выберите чат</h2>
              <p className="text-muted-foreground">
                Выберите существующий чат или начните новую беседу
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Right sidebar - Profile/Settings */}
      <div className="w-64 border-l border-border p-4 space-y-6">
        <div className="text-center">
          <Avatar className="h-20 w-20 mx-auto mb-3">
            <AvatarFallback className="text-lg">{currentUser[0]}</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold">{currentUser}</h3>
          <p className="text-sm text-muted-foreground">@{currentUser.toLowerCase().replace(' ', '_')}</p>
        </div>
        
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Icon name="User" className="h-4 w-4 mr-2" />
            Профиль
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Icon name="Users" className="h-4 w-4 mr-2" />
            Контакты
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Icon name="Bell" className="h-4 w-4 mr-2" />
            Уведомления
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Icon name="Shield" className="h-4 w-4 mr-2" />
            Приватность
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Icon name="Settings" className="h-4 w-4 mr-2" />
            Настройки
          </Button>
        </div>
        
        <div className="pt-4 border-t border-border space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>🔒 E2E шифрование</span>
            <Badge variant="secondary" className="text-xs">v1.0</Badge>
          </div>
          <Button 
            variant="outline" 
            className="w-full text-red-600 hover:text-red-700 justify-start" 
            onClick={() => setCurrentView('auth')}
          >
            <Icon name="LogOut" className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;