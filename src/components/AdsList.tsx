import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adsAPI, categoriesAPI, favoritesAPI, votesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Ad, Category } from '../types';
import '../styles/Ads.css';

export const AdsList = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [likesCount, setLikesCount] = useState<Record<number, number>>({});
  const [inFlightLikes, setInFlightLikes] = useState<Set<number>>(new Set());
  const [viewsCount, setViewsCount] = useState<Record<number, number>>({});

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadCategories();
    loadAds();
  }, []);

  useEffect(() => {
    // when auth state changes, load user's favorites
    if (isAuthenticated) {
      (async () => {
        try {
          const res = await favoritesAPI.list();
          const favSet = new Set<number>((res.data || []).map((a: any) => a.id));
          setFavorites(favSet);
        } catch (err) {
          console.warn('Не удалось загрузить избранное', err);
        }
      })();
    } else {
      setFavorites(new Set());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadAds();
  }, [selectedCategory]);


  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
    }
  };

  const loadAds = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await adsAPI.getAll({
        status: 'ACTIVE',
        categoryId: selectedCategory || undefined,
      });
      const adsList = response.data.content || response.data;
      setAds(adsList);
      // fetch like counts and view counts for visible ads
      try {
        const likePromises = (adsList || []).map((a: any) =>
          votesAPI.getCounts(a.id)
            .then(res => ({ id: a.id, likes: res.data.likes || 0 }))
            .catch(() => ({ id: a.id, likes: 0 }))
        );
        const viewPromises = (adsList || []).map((a: any) =>
          adsAPI.getViewsCount(a.id)
            .then(res => ({ id: a.id, views: res.data ?? 0 }))
            .catch(() => ({ id: a.id, views: 0 }))
        );
        const [likeResults, viewResults] = await Promise.all([
          Promise.all(likePromises),
          Promise.all(viewPromises),
        ]);
        const likeCounts: Record<number, number> = {};
        likeResults.forEach((r) => { likeCounts[r.id] = r.likes; });
        setLikesCount(likeCounts);
        const viewCounts: Record<number, number> = {};
        viewResults.forEach((r) => { viewCounts[r.id] = r.views; });
        setViewsCount(viewCounts);
      } catch (cErr) {
        console.warn('Не удалось загрузить счётчики лайков/просмотров для списка', cErr);
      }
    } catch (err: any) {
      setError('Ошибка загрузки объявлений');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdClick = (adId: number) => {
    navigate(`/ads/${adId}`);
  };

  const handleToggleFavorite = async (e: React.MouseEvent, adId: number) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const isFav = favorites.has(adId);
      if (isFav) {
        await favoritesAPI.removeFavorite(adId);
        setFavorites(prev => { const s = new Set(prev); s.delete(adId); return s; });
      } else {
        await favoritesAPI.addFavorite(adId);
        setFavorites(prev => { const s = new Set(prev); s.add(adId); return s; });
      }
      try { window.dispatchEvent(new CustomEvent('favorites:update')); } catch {}
    } catch (err) {
      console.error('Ошибка при работе с избранным:', err);
    }
  };

  const handleToggleLike = async (e: React.MouseEvent, adId: number) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (inFlightLikes.has(adId)) return;
    setInFlightLikes(prev => { const s = new Set(prev); s.add(adId); return s; });
    try {
        // simply send like request and refresh count
      await votesAPI.vote({ adId, type: 'LIKE' });
      try {
        const cnt = await votesAPI.getCounts(adId);
        setLikesCount(prev => ({ ...prev, [adId]: cnt.data.likes || 0 }));
      } catch {}
    } catch (err) {
      console.error('Ошибка при голосе:', err);
    } finally {
      setInFlightLikes(prev => { const s = new Set(prev); s.delete(adId); return s; });
    }
  };

  return (
    <div className="ads-page">
      <div className="ads-header">
        <h1>Bordo - Интернет-магазин скота</h1>
        <p>Найдите лучший скот по лучшим ценам</p>
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Поиск по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select
            className="search-category-select"
            value={selectedCategory !== null ? String(selectedCategory) : ''}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedCategory(val ? parseInt(val) : null);
            }}
          >
            <option value="">Все категории</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="ads-container">
        <main className="ads-grid-container">
          {error && <div className="error-message">{error}</div>}
          
          {isLoading ? (
            <div className="loading">Загрузка объявлений...</div>
          ) : ads.filter(ad => ad.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
            <div className="no-ads">Объявления не найдены</div>
          ) : (
            <div className="ads-grid">
              {ads.filter(ad => ad.title.toLowerCase().includes(searchQuery.toLowerCase())).map(ad => (
                <div
                  key={ad.id}
                  className="ad-card"
                  onClick={() => handleAdClick(ad.id)}
                >
                  <div className="ad-image-placeholder">
                    {ad.images && ad.images.length > 0 ? (
                      <img
                        src={ad.images.find(i => i.main)?.url || ad.images[0].url}
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
                      <span className="ad-views">👁️ {viewsCount[ad.id] ?? 0}</span>
                      <span className="ad-date">
                        {new Date(ad.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
