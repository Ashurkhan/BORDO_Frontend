import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adsAPI, favoritesAPI, votesAPI, chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Ad } from '../types';
import '../styles/AdDetails.css';

export const AdDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [ad, setAd] = useState<Ad | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [likes, setLikes] = useState<number>(0);
  const [voteState, setVoteState] = useState<boolean | null>(null); // true == liked
  const [voteInFlight, setVoteInFlight] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [viewsCount, setViewsCount] = useState<number>(0);

  useEffect(() => {
    loadAdDetails();
  }, [id]);

  const loadAdDetails = async () => {
    try {
      setIsLoading(true);
      const response = await adsAPI.getById(Number(id));
      const adData = response.data;
      setAd(adData);
      const initialImg = adData.images?.find((i: any) => i.main)?.url || adData.images?.[0]?.url || null;
      setSelectedImage(initialImg);
      // зарегистрировать просмотр (уникальный по пользователю) и загрузить актуальный счётчик
      try {
        await adsAPI.addView(adData.id, user?.id ?? undefined);
      } catch (vErr) {
        console.warn('Не удалось отправить просмотр', vErr);
      }
      try {
        const viewsRes = await adsAPI.getViewsCount(adData.id);
        setViewsCount(viewsRes.data ?? 0);
      } catch (cErr) {
        console.warn('Не удалось получить счётчик просмотров', cErr);
      }
      // Проверяем есть ли в избранном
      if (response.data.favoritedBy) {
        setIsFavorite(response.data.favoritedBy.length > 0);
      }
      // загрузим текущие счетчики голосов
      try {
        const counts = await votesAPI.getCounts(Number(id));
        setLikes(counts.data.likes || 0);
        // no dislikes used in Lalafo-like UI
      } catch (vErr) {
        console.warn('Не удалось получить счётчики голосов', vErr);
      }
      
      // Determine if current user liked this ad
      if (isAuthenticated && response.data.favoritedBy) {
        // Since we don't have a direct endpoint for whether the CURRENT user liked it,
        // we might leave voteState as null for now or evaluate from a separate endpoint payload if provided
        setVoteState(false);
      }
    } catch (err) {
      setError('Объявление не найдено');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await favoritesAPI.removeFavorite(Number(id));
      } else {
        await favoritesAPI.addFavorite(Number(id));
      }
      setIsFavorite(!isFavorite);
      // notify header and other components to refresh favorites
      try { window.dispatchEvent(new CustomEvent('favorites:update')); } catch {}
    } catch (err) {
      console.error('Ошибка при добавлении в избранное:', err);
    }
  };

  const handleContactSeller = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      if (ad) {
        const res = await chatAPI.openChat(ad.id);
        navigate(`/chats/${res.data.id}`);
      }
    } catch (err) {
      console.error('Ошибка при создании/открытии чата:', err);
      alert('Не удалось открыть чат с продавцом.');
    }
  };

  if (isLoading) {
    return <div className="loading">Загрузка объявления...</div>;
  }

  if (error || !ad) {
    return <div className="error-message">{error || 'Объявление не найдено'}</div>;
  }

  return (
    <div className="ad-details-page">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Вернуться к каталогу
      </button>

      <div className="ad-details-container">
       <div className="ad-details-left">
  {/* ГЛАВНОЕ ФОТО (теперь зависит от selectedImage) */}
  <div className="ad-image-placeholder-large">
    {selectedImage ? (
      <img
        src={selectedImage}
        alt={ad.title}
        className="ad-main-image"
      />
    ) : (
      <div className="ad-image-empty-large">Нет фото</div>
    )}
    <span className="category-badge">{ad.category?.name}</span>
    <span className="status-badge">{ad.status}</span>
  </div>

  {/* СПИСОК МИНИАТЮР */}
  <div className="ad-images-thumbnails">
    {ad.images && ad.images.length > 0 ? (
      ad.images.map((img) => (
        <img 
          key={img.id} 
          src={img.url} 
          alt={`img-${img.id}`} 
          // Добавляем класс active, если это фото сейчас выбрано
          className={`thumbnail ${selectedImage === img.url ? 'active' : ''}`}
          // МЕНЯЕМ ФОТО ПРИ КЛИКЕ
          onClick={() => setSelectedImage(img.url)}
          style={{ 
            cursor: 'pointer', 
            border: selectedImage === img.url ? '2px solid #007bff' : '1px solid #ddd' 
          }}
        />
      ))
    ) : (
      <div className="thumbnail">Нет фото</div>
    )}
  </div>
</div>

        <div className="ad-details-right">
          <h1>{ad.title}</h1>
          
          <div className="ad-price-section">
            <div className="price-main">{ad.price} {ad.currency}</div>
            <div className="ad-actions">
              <div className="vote-controls">
                <button
                  className={`vote-btn like ${voteState ? 'active' : ''}`}
                  onClick={async () => {
                      if (!isAuthenticated) { navigate('/login'); return; }
                      if (voteInFlight) return;
                      setVoteInFlight(true);
                      try {
                        if (voteState) {
                          await votesAPI.vote({ adId: ad.id, type: 'LIKE', remove: true });
                        } else {
                          await votesAPI.vote({ adId: ad.id, type: 'LIKE' });
                        }
                        // refresh count and user like state from server
                        try {
                          const counts = await votesAPI.getCounts(ad.id);
                          setLikes(counts.data.likes || 0);
                        } catch {}
                      } catch (err) {
                        console.error('Ошибка при голосе:', err);
                      } finally {
                        setVoteInFlight(false);
                      }
                    }}
                  disabled={voteInFlight}
                  >{voteState ? '❤️' : '🤍'} {likes}</button>
              </div>
              <button 
                className={`favorite-button ${isFavorite ? 'active' : ''}`}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? '🔖 В закладках' : '🔖 В закладки'}
              </button>
              {isAuthenticated && user?.id === ad.seller?.id && (
                <button
                  className="edit-button"
                  onClick={() => navigate(`/ads/${ad.id}/edit`)}
                >
                  ✏️ Редактировать
                </button>
              )}
            </div>
          </div>

          <div className="ad-meta-info">
            <div className="meta-item">
              <span className="meta-label">Просмотров:</span>
              <span className="meta-value">{viewsCount}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Опубликовано:</span>
              <span className="meta-value">{new Date(ad.createdAt).toLocaleDateString('ru-RU')}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Обновлено:</span>
              <span className="meta-value">{new Date(ad.updatedAt).toLocaleDateString('ru-RU')}</span>
            </div>
          </div>

          <div className="ad-location">
            <strong>📍 Местоположение:</strong>
            <p>{ad.location?.city}, {ad.location?.region}</p>
          </div>

          <div className="ad-description-section">
            <h3>Описание</h3>
            <p>{ad.description}</p>
          </div>

          <div className="ad-seller-section">
            <h3>Продавец</h3>
            <div className="seller-info">
              <div>
                <p><strong>{ad.seller?.fullName}</strong></p>
                <p>📧 {ad.seller?.email}</p>
                <p>📱 {ad.seller?.phone}</p>
              </div>
              <button className="contact-button" onClick={handleContactSeller}>
                Связаться с продавцом
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
