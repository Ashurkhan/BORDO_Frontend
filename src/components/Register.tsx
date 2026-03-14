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
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const handleOAuthRegister = () => {
    const backendBase =
      import.meta.env.VITE_BACKEND_BASE_URL ||
      (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'https://jetihub-production.up.railway.app');
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
    
    // Бэкенд ожидает ровно 13 символов согласно аннотации @Size(min=13, max=13)
    // Но также имеет Regex ^\+?[0-9 ]+$
    if (formData.phone.replace(/\s/g, '').length !== 13) {
      setError('Введите номер телефона (13 символов, включая +)');
      return;
    }

    try {
      await register(formData);
      setIsRegistered(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown }; message?: string; code?: string };
      const msg = getErrorMessage(e);
      setError(msg);
    }
  };

  if (isRegistered) {
    return (
      <div className="auth-container">
        <div className="auth-form success-step">
          <div className="success-icon">✉️</div>
          <h1>Аккаунт создан!</h1>
          <p className="auth-subtitle">
            Мы отправили письмо для подтверждения на <strong>{formData.email}</strong>.
          </p>
          <div className="info-box">
            Пожалуйста, перейдите по ссылке в письме, чтобы активировать свой аккаунт. 
            После этого вы сможете войти в систему.
          </div>
          <button className="submit-button" onClick={() => navigate('/login')}>
            Перейти к входу
          </button>
          <p className="auth-link">
            Не получили письмо? <Link to="/email-verification">Отправить повторно</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Регистрация в JetiHub</h1>
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
              placeholder="+996700111222"
            />
            <small className="form-hint">Пример: +996700111222 (13 символов)</small>
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
