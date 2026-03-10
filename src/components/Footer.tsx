export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>🐄 Bordo</h4>
          <p>Интернет-магазин скота и кормов</p>
        </div>

        <div className="footer-section">
          <h4>Навигация</h4>
          <ul>
            <li><a href="/">Каталог</a></li>
            <li><a href="/favorites">Избранное</a></li>
            <li><a href="/profile">Профиль</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Контакты</h4>
          <p>📧 info@bordo.kg</p>
          <p>📱 +996 (700) 01-02-03</p>
        </div>

        <div className="footer-section">
          <h4>О нас</h4>
          <p>Ведущая платформа для покупки и продажи скота и кормов. Надежно, просто, эффективно.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Bordo. Все права защищены.</p>
      </div>
    </footer>
  );
};
