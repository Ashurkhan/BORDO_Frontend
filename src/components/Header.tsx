import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import '../styles/Header.css';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [favCount, setFavCount] = useState<number>(0);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);


  const loadFavCount = async () => {
    if (!isAuthenticated) { setFavCount(0); return; }
    try {
      const res = await (await import('../services/api')).favoritesAPI.list();
      setFavCount((res.data || []).length || 0);
    } catch (err) {
      console.warn('Не удалось загрузить количество избранного', err);
    }
  };

  // reload favourites on mount and when event dispatched
  useEffect(() => {
    loadFavCount();
    const handler = () => loadFavCount();
    window.addEventListener('favorites:update', handler);
    return () => window.removeEventListener('favorites:update', handler);
  }, [isAuthenticated]);

  // Load and poll unread chat messages
  const loadUnreadCount = async () => {
    if (!isAuthenticated) { setUnreadCount(0); return; }
    try {
      const res = await chatAPI.getUserChats();
      const chats = res.data || [];
      const totalUnread = chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
      setUnreadCount(totalUnread);
    } catch (err) {
      // ignore silently for polling
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadCount();
      // Setup polling every 15 seconds
      intervalRef.current = window.setInterval(() => {
        loadUnreadCount();
      }, 15000);
    } else {
      setUnreadCount(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuthenticated, location.pathname]); // also reload when navigation changes (like returning from chat room)


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon">🚀</div>
          <div className="logo-text">
            <h1>JetiHub</h1>
            <p>Интернет-магазин скота</p>
          </div>
        </Link>

        <nav className="nav-menu">
          <Link to="/" className="nav-link">Каталог</Link>
          {isAuthenticated && (
            <>
              <Link to="/ads/create" className="nav-link">➕ Объявление</Link>
              <Link to="/favorites" className="nav-link">❤️ Избранное {favCount > 0 ? `(${favCount})` : ''}</Link>
              <Link to="/chats" className="nav-link">
                💬 Сообщения {unreadCount > 0 && <span className="header-unread-badge">{unreadCount}</span>}
              </Link>
              <Link to="/profile" className="nav-link">👤 Профиль</Link>
            </>
          )}
        </nav>


        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <span className="user-greeting">Привет, {user?.fullName.split(' ')[0]}!</span>
              <button className="logout-btn" onClick={handleLogout}>
                Выход
              </button>
            </>
          ) : (
            <>
              <button 
                className="login-btn"
                onClick={() => navigate('/login')}
              >
                Вход
              </button>
              <button 
                className="register-btn"
                onClick={() => navigate('/register')}
              >
                Регистрация
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
