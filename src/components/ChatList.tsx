import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatAPI, adsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { ChatResponse } from '../types';
import '../styles/ChatList.css';

export const ChatList = () => {
  const [chats, setChats] = useState<ChatResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      const res = await chatAPI.getUserChats();
      let loadedChats = res.data;

      // Try to backfill missing adImageUrls by fetching ad details if needed
      loadedChats = await Promise.all(loadedChats.map(async (chat) => {
        if (!chat.adImageUrl) {
          try {
            const adRes = await adsAPI.getById(chat.adId);
            const adImages = adRes.data.images;
            if (adImages && adImages.length > 0) {
              const mainImg = adImages.find(img => img.main)?.url || adImages[0].url;
              return { ...chat, adImageUrl: mainImg };
            }
          } catch (e) {
            console.warn(`Could not fetch image for ad ${chat.adId}`);
          }
        }
        return chat;
      }));

      setChats(loadedChats);
    } catch (err) {
      console.error('Failed to load chats', err);
      // Fallback empty state so UI doesn't break
      setChats([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="chats-loading">Загрузка чатов...</div>;
  }

  return (
    <div className="chat-list-container">
      <h2>Мои сообщения</h2>
      
      {chats.length === 0 ? (
        <div className="no-chats">
          <p>У вас пока нет активных диалогов.</p>
          <button className="browse-btn" onClick={() => navigate('/')}>Перейти к объявлениям</button>
        </div>
      ) : (
        <div className="chats-grid">
          {chats.map(chat => {
            const isSeller = chat.sellerId === user?.id;
            const otherUserName = isSeller ? chat.buyerName : chat.sellerName;
            const hasUnread = chat.unreadCount && chat.unreadCount > 0;
            const chatLastMessage = chat.messages && chat.messages.length > 0 
                ? chat.messages[chat.messages.length - 1] 
                : undefined;

            return (
              <div 
                key={chat.id} 
                className={`chat-card ${hasUnread ? 'unread' : ''}`}
                onClick={() => navigate(`/chats/${chat.id}`)}
              >
                <div className="chat-card-header">
                  <span className="other-user-name">{otherUserName}</span>
                  <span className="chat-date">
                    {new Date(chat.updatedAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                
                <div className="chat-card-body">
                  <div className="chat-ad-info">
                    {chat.adImageUrl ? (
                      <img src={chat.adImageUrl} alt="Ad thumbnail" className="chat-ad-thumb" />
                    ) : (
                      <div className="chat-ad-thumb fallback"></div>
                    )}
                    <span className="chat-ad-title" title={chat.adTitle}>{chat.adTitle}</span>
                  </div>
                  
                  {chatLastMessage && (
                    <div className="chat-last-message">
                      <span className="msg-preview">{chatLastMessage.content}</span>
                    </div>
                  )}
                </div>
                
                {hasUnread && (
                  <div className="unread-badge">{chat.unreadCount}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
