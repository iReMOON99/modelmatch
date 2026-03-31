import { useState } from 'react';
import { 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video,
  Paperclip,
  Smile,
  CheckCheck,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockConversations, mockMessages, getUserById } from '@/data/mock';

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = mockConversations.map(conv => {
    const otherUserId = conv.participantIds.find(id => id !== 'current-user') || '';
    const otherUser = getUserById(otherUserId);
    const lastMessage = mockMessages
      .filter(m => 
        (m.senderId === 'current-user' && m.receiverId === otherUserId) ||
        (m.senderId === otherUserId && m.receiverId === 'current-user')
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    
    return {
      ...conv,
      otherUser,
      lastMessage,
    };
  });

  const filteredConversations = conversations.filter(conv => 
    conv.otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const otherUser = selectedConv?.otherUser;

  const conversationMessages = selectedConversation 
    ? mockMessages.filter(m => 
        (m.senderId === 'current-user' && m.receiverId === otherUser?.id) ||
        (m.senderId === otherUser?.id && m.receiverId === 'current-user')
      ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    : [];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Send message logic
      setMessageText('');
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
      <div className={`w-full lg:w-80 bg-white border-r border-gray-200 ${selectedConversation ? 'hidden lg:block' : ''}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left ${
                  selectedConversation === conv.id ? 'bg-amber-50' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conv.otherUser?.avatar} />
                    <AvatarFallback>{conv.otherUser?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {conv.unreadCount && conv.unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conv.otherUser?.name}
                    </h3>
                    {conv.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className={`text-sm truncate ${conv.unreadCount ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {conv.lastMessage.senderId === 'current-user' && (
                        <span className="text-gray-400 mr-1">You:</span>
                      )}
                      {conv.lastMessage.content}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      {selectedConversation && otherUser ? (
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setSelectedConversation(null)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Avatar className="w-10 h-10">
                <AvatarImage src={otherUser.avatar} />
                <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {conversationMessages.map((message) => {
                const isOwn = message.senderId === 'current-user';
                return (
                  <div 
                    key={message.id} 
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                      <div 
                        className={`px-4 py-2 rounded-2xl ${
                          isOwn 
                            ? 'bg-amber-500 text-white rounded-br-none' 
                            : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${isOwn ? 'justify-end' : ''}`}>
                        {new Date(message.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                        {isOwn && (
                          <CheckCheck className={`w-4 h-4 ${message.isRead ? 'text-blue-500' : ''}`} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Smile className="w-5 h-5" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                className="bg-amber-500 hover:bg-amber-600"
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Send className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Your Messages
            </h3>
            <p className="text-gray-500 max-w-sm">
              Select a conversation to start messaging with models and agencies
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
