import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRequest } from '../types';
import '../styles/Auth.css';

function getErrorMessage(err: { response?: { data?: unknown; status?: number }; message?: string; code?: string }): string {
  if (!err.response) {
    if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
      return 'Сервер недоступен. Запустите бэкенд на localhost:8080.';
    }
    return err.message || 'Ошибка сети. Проверьте подключение.';
  }
  const data = err.response.data;
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (typeof d.message === 'string') return d.message;
    if (Array.isArray(d.errors) && d.errors.length > 0) {
      const first = d.errors[0] as Record<string, string>;
      return first?.defaultMessage || first?.message || String(d.errors[0]);
    }
  }
  if (err.response.status === 400) return 'Неверные данные. Проверьте форму.';
  if (err.response.status === 409) return 'Пользователь с таким email уже существует.';
  return 'Ошибка регистрации. Попробуйте снова.';
}

export const Register = () => {
  const [formData, setFormData] = useState<UserRequest>({
    fullName: '',
    phone: '',
    email: '',
    passwordHash: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const handleOAuthRegister = () => {
    const backendBase =
      import.meta.env.VITE_BACKEND_BASE_URL ||
      (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'https://bordo-production.up.railway.app');
    window.location.href = `${backendBase}/oauth2/authorization/google`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Валидация
    if (formData.passwordHash.length < 5 || formData.passwordHash.length > 8) {
      setError('Пароль должен быть от 5 до 8 символов');
      return;
    }

    if (formData.passwordHash !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Введите корректный email');
      return;
    }
    if(formData.phone.length<13 || formData.phone.length>13){
      setError('Введите корректный номер телефона как указано в примере');
      return;
    }

    try {
      await register(formData);
      navigate('/login', { state: { message: 'Регистрация успешна. Войдите в аккаунт.' } });
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown }; message?: string; code?: string };
      const msg = getErrorMessage(e);
      setError(msg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Регистрация в Bordo</h1>
        <p className="auth-subtitle">Присоединяйтесь к нашему сообществу</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">ФИО</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Иван Иванов"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Телефон</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+996 (700) 11-11-11"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              name="passwordHash"
              value={formData.passwordHash}
              onChange={handleChange}
              required
              placeholder="5-8 символов"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Повторите пароль"
            />
          </div>

          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button type="button" className="submit-button" onClick={handleOAuthRegister}>
            Зарегистрироваться через Google
          </button>
        </div>

        <p className="auth-link">
          Уже есть аккаунт? <Link to="/login">Войдите</Link>
        </p>
      </div>
    </div>
  );
};
