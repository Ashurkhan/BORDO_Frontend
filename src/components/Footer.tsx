import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>🚀 JetiHub</h4>
          <p>Интернет-магазин скота и кормов</p>
        </div>

        <div className="footer-section">
          <h4>Навигация</h4>
          <ul>
            <li><Link to="/">Каталог</Link></li>
            <li><Link to="/favorites">Избранное</Link></li>
            <li><Link to="/profile">Профиль</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Контакты</h4>
          <p>📧 info@jetihub.kg</p>
          <p>📱 +996 (700) 01-02-03</p>
        </div>

        <div className="footer-section">
          <h4>О нас</h4>
          <p>Ведущая платформа для покупки и продажи скота и кормов. Надежно, просто, эффективно.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 JetiHub. Все права защищены.</p>
      </div>
    </footer>
  );
};
