import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserCredentialsDto } from '../types';
import '../styles/Auth.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const successMessage = (location.state as { message?: string })?.message;

  const handleOAuthLogin = () => {
    const backendBase =
      import.meta.env.VITE_BACKEND_BASE_URL ||
      (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'https://bordo-production.up.railway.app');
    window.location.href = `${backendBase}/oauth2/authorization/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({ email, password } as UserCredentialsDto);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка входа. Попробуйте снова.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Вход в Bordo</h1>
        <p className="auth-subtitle">Интернет-магазин скота</p>
        
        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Минимум 5 символов"
            />
          </div>

          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? 'Загрузка...' : 'Войти'}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button type="button" className="submit-button" onClick={handleOAuthLogin}>
            Войти через Google
          </button>
        </div>

        <p className="auth-link">
          Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
        </p>
      </div>
    </div>
  );
};
