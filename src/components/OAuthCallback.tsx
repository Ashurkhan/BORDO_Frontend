import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

export const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithTokens } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const search = window.location.search || location.search;
    const params = new URLSearchParams(search);
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');
    const phoneMissing = params.get('phoneMissing') === 'true';

    if (!token || !refreshToken) {
      setError('Не удалось получить токены авторизации. Попробуйте войти ещё раз.');
      return;
    }

    (async () => {
      try {
        await loginWithTokens(token, refreshToken);
        // если у пользователя нет телефона, сразу отправляем в профиль для дозаполнения
        if (phoneMissing) {
          navigate('/profile', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } catch (e) {
        setError('Ошибка при обработке OAuth-авторизации. Попробуйте снова.');
      }
    })();
    // выполняем логику ровно один раз при монтировании
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Вход через OAuth</h1>
        <p className="auth-subtitle">Bordo — интернет-магазин скота</p>
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="loading">Завершаем вход, подождите...</div>
        )}
      </div>
    </div>
  );
};

