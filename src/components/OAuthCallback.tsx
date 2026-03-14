import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

export const OAuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Если AuthContext уже увидел токены и авторизовал нас
    if (isAuthenticated) {
      console.log('OAuth Callback - Already authenticated, navigating home...');
      const params = new URLSearchParams(window.location.search);
      const phoneMissing = params.get('phoneMissing') === 'true';
      
      // Перенаправляем на главную или в профиль
      setTimeout(() => {
        navigate(phoneMissing ? '/profile' : '/', { replace: true });
      }, 300);
      return;
    }

    // Если прошло 5 секунд и мы всё еще не вошли - значит что-то не так
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        setError('Время ожидания входа истекло. Пожалуйста, попробуйте еще раз.');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-form" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div className="success-icon">🔑</div>
        <h1>Авторизация...</h1>
        <p className="auth-subtitle">
          {isAuthenticated ? `Привет, ${user?.fullName}! Переходим в приложение...` : 'Связываемся с Google и проверяем данные...'}
        </p>
        
        {error && (
          <>
            <div className="error-message">{error}</div>
            <button className="submit-button" onClick={() => navigate('/login')}>
              Вернуться к входу
            </button>
          </>
        )}

        {!error && !isAuthenticated && (
          <div className="loading">
             <div className="spinner"></div>
             Пожалуйста, подождите...
          </div>
        )}
      </div>
    </div>
  );
};

