import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { MessageResponse, ChatResponse } from '../types';
import '../styles/ChatRoom.css';

export const ChatRoom = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [chatInfo, setChatInfo] = useState<ChatResponse | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      loadMessages();
      markChatAsRead();
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!chatId) return;
    try {
      setIsLoading(true);
      
      // Load messages
      const messagesRes = await chatAPI.getMessages(Number(chatId), 0, 50);
      const loadedMessages = messagesRes.data.content || [];
      setMessages(loadedMessages.reverse());

      // Attempt to load chat info (might fail if endpoint not implemented)
      try {
        const chatsRes = await chatAPI.getUserChats();
        const currentChat = chatsRes.data.find(c => c.id === Number(chatId));
        if (currentChat) setChatInfo(currentChat);
      } catch (chatInfoErr) {
        console.warn('Could not load chat info details (like ad title or user names). Endpoint may not be implemented yet.', chatInfoErr);
      }

    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setIsLoading(false);
    }
  };

  const markChatAsRead = async () => {
    if (!chatId) return;
    try {
      await chatAPI.markAsRead(Number(chatId));
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    const contentTemp = newMessage;
    setNewMessage(''); // optimistic clear

    try {
      const resp = await chatAPI.sendMessage({
        chatId: Number(chatId),
        content: contentTemp,
      });
      
      const newMsg = resp.data;
      // Backend might return sentAt instead of createdAt for message, or missing date. 
      // If date is invalid or missing, fallback to current time
      if (!newMsg.createdAt) {
        newMsg.createdAt = new Date().toISOString();
      }
      
      setMessages(prev => [...prev, newMsg]);
    } catch (err) {
      console.error('Failed to send message', err);
      // rollback or show error ideally
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOtherUserName = () => {
    if (!chatInfo || !user) return 'Seller';
    return chatInfo.sellerId === user.id ? chatInfo.buyerName : chatInfo.sellerName;
  };

  if (isLoading) {
    return <div className="chat-loading">Загрузка сообщений...</div>;
  }

  return (
    <div className="chat-room-container">
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate('/chats')}>
          ← Назад
        </button>
        <div className="chat-header-info">
          <h2>{getOtherUserName()}</h2>
          {chatInfo?.adTitle && <span className="chat-ad-title">Объявление: {chatInfo.adTitle}</span>}
        </div>
      </div>

      <div className="messages-list">
        {messages.length === 0 ? (
          <div className="no-messages">Нет сообщений. Напишите первым!</div>
        ) : (
          messages.map(msg => {
            const isMine = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`message-wrapper ${isMine ? 'mine' : 'theirs'}`}>
                <div className="message-content">
                  <p>{msg.content}</p>
                  <span className="message-time">
                    {msg.createdAt 
                      ? new Date(msg.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                      : new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Напишите сообщение..."
          autoFocus
        />
        <button type="submit" disabled={!newMessage.trim()}>
          Отправить
        </button>
      </form>
    </div>
  );
};
