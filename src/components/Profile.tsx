import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adsAPI } from '../services/api';
import { favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Ad } from '../types';
import '../styles/Profile.css';

export const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const [userAds, setUserAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<Ad[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'ads' | 'favorites'>('info');
  const navigate = useNavigate();
  const [phoneInput, setPhoneInput] = useState<string>(user?.phone || '');
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserAds();
      setPhoneInput(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadUserAds = async () => {
    try {
      setIsLoading(true);
      const response = await adsAPI.getBySeller();
      setUserAds(response.data);
      console.log('Мои объявления загружены:', response.data);
    } catch (err) {
      console.error('Ошибка загрузки объявлений:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAd = async (adId: number) => {
    if (confirm('Вы уверены?')) {
      try {
        await adsAPI.delete(adId);
        setUserAds(userAds.filter(ad => ad.id !== adId));
      } catch (err) {
        console.error('Ошибка удаления:', err);
      }
    }
  };

  const loadFavorites = async () => {
    try {
      const res = await favoritesAPI.list();
      setFavorites(res.data || []);
    } catch (err) {
      console.error('Ошибка загрузки избранного:', err);
    }
  };

  

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <div className="avatar-circle">{user?.fullName}</div>
          </div>
          <h2>{user?.fullName}</h2>
          <p className="profile-email">{user?.email}</p>

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{userAds.length}</span>
              <span className="stat-label">Объявлений</span>
            </div>
            <div className="stat">
              <span className="stat-value">⭐</span>
              <span className="stat-label">Рейтинг</span>
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            Выход
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-tabs">
            <button
              className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              Личная информация
            </button>
            <button
              className={`tab-button ${activeTab === 'ads' ? 'active' : ''}`}
              onClick={() => setActiveTab('ads')}
            >
              Мои объявления
            </button>
            <button
              className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              Избранное
            </button>
          </div>

          {activeTab === 'info' && (
            <div className="tab-content">
              <h3>Информация профиля</h3>
              {!user?.phone && (
                <div className="error-message" style={{ marginBottom: '16px' }}>
                  Похоже, у вашего аккаунта не указан номер телефона. Пожалуйста, добавьте его, чтобы полноценно
                  пользоваться сервисом.
                </div>
              )}
              <div className="info-grid">
                <div className="info-item">
                  <label>ФИО</label>
                  <p>{user?.fullName}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{user?.email}</p>
                </div>
                <div className="info-item">
                  <label>Телефон</label>
                  {user?.phone ? (
                    <p>{user.phone}</p>
                  ) : (
                    <div>
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="+996 (700) 11-11-11"
                        className="profile-phone-input"
                      />
                      {phoneError && <div className="error-message" style={{ marginTop: '8px' }}>{phoneError}</div>}
                      <button
                        type="button"
                        className="save-phone-button"
                        disabled={isSavingPhone || !phoneInput}
                        onClick={async () => {
                          setPhoneError(null);
                          if (phoneInput.length < 10) {
                            setPhoneError('Введите корректный номер телефона');
                            return;
                          }
                          try {
                            setIsSavingPhone(true);
                            await updateProfile({ phone: phoneInput });
                          } catch (err: any) {
                            const msg =
                              err?.response?.data?.message ||
                              err?.message ||
                              'Не удалось сохранить телефон. Попробуйте позже.';
                            setPhoneError(msg);
                          } finally {
                            setIsSavingPhone(false);
                          }
                        }}
                        style={{ marginTop: '8px' }}
                      >
                        {isSavingPhone ? 'Сохранение...' : 'Сохранить телефон'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <label>Дата регистрации</label>
                  <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="tab-content">
              <div className="ads-header-section">
                <h3>Мои объявления</h3>
                <button className="create-ad-btn" onClick={() => navigate('/ads/create')}>
                  + Создать объявление
                </button>
              </div>

              {isLoading ? (
                <div className="loading">Загрузка...</div>
              ) : userAds.length === 0 ? (
                <p className="no-ads">У вас нет объявлений</p>
              ) : (
                <div className="user-ads-table">
                  {userAds.map(ad => (
                    <div key={ad.id} className="user-ad-row">
                      <div className="user-ad-info">
                        <h4>{ad.title}</h4>
                        <p>{ad.category?.name} - {ad.price} {ad.currency}</p>
                        <span className={`status-badge ${ad.status.toLowerCase()}`}>{ad.status}</span>
                      </div>
                      <div className="user-ad-actions">
                        <button className="edit-btn" onClick={() => navigate(`/ads/${ad.id}/edit`)}>
                          Редактировать
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteAd(ad.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="tab-content">
              <h3>Избранные объявления</h3>
              {favorites.length === 0 ? (
                <p>У вас нет избранных объявлений</p>
              ) : (
                <div className="ads-grid">
                  {favorites.map(ad => (
                    <div key={ad.id} className="ad-card" onClick={() => navigate(`/ads/${ad.id}`)}>
                      <div className="ad-image-placeholder">
                        {ad.images && ad.images.length > 0 ? (
                          <img src={ad.images.find(i => i.main)?.url || ad.images[0].url} alt={ad.title} className="ad-image" />
                        ) : (
                          <div className="ad-image-empty">Нет фото</div>
                        )}
                        <span className="ad-category-badge">{ad.category?.name}</span>
                      </div>
                      <div className="ad-content">
                        <h3>{ad.title}</h3>
                        <p className="ad-price-large">{ad.price} {ad.currency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


        </div>
      </div>
    </div>
  );
};
