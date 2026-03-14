import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoritesAPI, getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Ad } from '../types';
import '../styles/Favorites.css';

export const Favorites = () => {
  const [favorites, setFavorites] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadFavorites();
  }, [isAuthenticated, navigate]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await favoritesAPI.list();
      setFavorites(response.data);
    } catch (err) {
      console.error('Ошибка загрузки избранного:', err);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>❤️ Избранные объявления</h1>
        <button className="back-button" onClick={() => navigate('/')}>
          ← Вернуться к каталогу
        </button>
      </div>

      {isLoading ? (
        <div className="loading">Загрузка...</div>
      ) : favorites.length === 0 ? (
        <div className="no-favorites">
          <p>У вас нет избранных объявлений</p>
          <button onClick={() => navigate('/')}>Перейти в каталог</button>
        </div>
      ) : (
        <div className="ads-grid">
          {favorites.map(ad => (
            <div
              key={ad.id}
              className="ad-card"
              onClick={() => navigate(`/ads/${ad.id}`)}
            >
              <div className="ad-image-placeholder">
                {ad.images && ad.images.length > 0 ? (
                  <img
                    src={getImageUrl(ad.images.find(i => i.main)?.url || ad.images[0].url)}
                    alt={ad.title}
                    className="ad-image"
                  />
                ) : (
                  <div className="ad-image-empty">Нет фото</div>
                )}
                <span className="ad-category-badge">{ad.category?.name || 'Скот'}</span>
              </div>
              <div className="ad-content">
                <div className="ad-title-price">
                  <h3>{ad.title}</h3>
                  <span className="ad-price-large">{ad.price} {ad.currency}</span>
                </div>
                <p className="ad-description">{ad.description?.substring(0, 60)}...</p>
                <div className="ad-meta">
                  <span className="ad-views">👁️ {ad.views?.length || 0}</span>
                  <span className="ad-date">
                    {new Date(ad.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
