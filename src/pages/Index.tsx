import { useState } from 'react';
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

  const mockChats: User[] = [
    { id: '1', name: 'Анна Петрова', avatar: '/placeholder.svg', status: 'online', lastMessage: 'Привет! Как дела?', time: '14:30', unread: 2 },
    { id: '2', name: 'Команда Разработки', avatar: '/placeholder.svg', status: 'online', lastMessage: 'Новые обновления готовы', time: '13:45', unread: 1 },
    { id: '3', name: 'Михаил Соколов', avatar: '/placeholder.svg', status: 'offline', lastMessage: 'Увидимся завтра', time: '12:20' },
    { id: '4', name: 'Мария Иванова', avatar: '/placeholder.svg', status: 'online', lastMessage: 'Спасибо за помощь!', time: '11:15' },
  ];

  const mockMessages: Message[] = [
    { id: '1', sender: 'Анна Петрова', content: 'Привет! Как дела?', time: '14:28', isOwn: false },
    { id: '2', sender: 'Вы', content: 'Привет! Всё отлично, спасибо! А у тебя как?', time: '14:29', isOwn: true },
    { id: '3', sender: 'Анна Петрова', content: 'Тоже хорошо! Работаю над новым проектом', time: '14:30', isOwn: false },
    { id: '4', sender: 'Вы', content: 'Звучит интересно! Расскажешь подробнее?', time: '14:31', isOwn: true },
  ];

  const handleAuth = () => {
    setCurrentView('messenger');
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      // В реальном приложении здесь будет отправка сообщения через API
      setNewMessage('');
    }
  };

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
                  />
                  <Input
                    type="password"
                    placeholder="Пароль"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  />
                </div>
                <Button onClick={handleAuth} className="w-full" size="lg">
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
                  />
                </div>
                <Button onClick={handleAuth} className="w-full" size="lg">
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
            <Input placeholder="Поиск чатов..." className="pl-8" />
            <Icon name="Search" className="h-4 w-4 absolute left-2 top-3 text-muted-foreground" />
          </div>
        </div>
        
        {/* Chat list */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {mockChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
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
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                  
                  {chat.unread && (
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
              <AvatarFallback>В</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">Вы</p>
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
                  <AvatarFallback>А</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">Анна Петрова</h2>
                  <p className="text-sm text-green-600">в сети</p>
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
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
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
                <Button onClick={handleSendMessage}>
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
            <AvatarFallback className="text-lg">В</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold">Ваш профиль</h3>
          <p className="text-sm text-muted-foreground">@your_username</p>
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
          <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
            <Icon name="LogOut" className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;