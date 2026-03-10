import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { authAPI } from '../services/api';
import '../styles/Auth.css';

export const EmailVerificationResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const status = params.get('status');
  const reason = params.get('reason');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      setIsLoading(true);
      await authAPI.resendVerification(email);
      setMessage('Письмо с подтверждением отправлено повторно. Проверьте почту.');
    } catch (err: any) {
      setError(
        err?.response?.data
          || err?.message
          || 'Не удалось отправить письмо. Попробуйте позже.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isSuccess = status === 'success';

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>{isSuccess ? 'Почта подтверждена' : 'Подтверждение почты'}</h1>
        <p className="auth-subtitle">Bordo — интернет-магазин скота</p>

        {isSuccess ? (
          <>
            <div className="success-message">
              Ваш email успешно подтверждён. Теперь вы можете войти в аккаунт.
            </div>
            <button className="submit-button" onClick={() => navigate('/login')}>
              Перейти к входу
            </button>
          </>
        ) : (
          <>
            {reason && <div className="error-message">{decodeURIComponent(reason)}</div>}
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleResend}>
              <div className="form-group">
                <label htmlFor="email">Email для повторной отправки письма</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                />
              </div>
              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? 'Отправка...' : 'Отправить письмо ещё раз'}
              </button>
            </form>

            <p className="auth-link">
              Уже подтвердили почту? <Link to="/login">Перейти к входу</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

