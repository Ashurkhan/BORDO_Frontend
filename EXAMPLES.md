# 🐄 Bordo - Примеры использования

Этот документ содержит практические примеры для разработчиков.

---

## Примеры кода

### 1. Использование useAuth Hook

```tsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Привет, {user?.fullName}!</p>
          <button onClick={logout}>Выход</button>
        </>
      ) : (
        <p>Пожалуйста, авторизуйтесь</p>
      )}
    </div>
  );
}
```

### 2. Работа с API

```tsx
import { adsAPI } from './services/api';

// Получить все объявления
const response = await adsAPI.getAll({
  status: 'ACTIVE',
  categoryId: 1,
  page: 0,
  size: 10
});

// Получить одно объявление
const ad = await adsAPI.getById(5);

// Создать объявление
await adsAPI.create({
  title: 'Мои коровы',
  description: 'Отличное качество',
  price: 50000,
  currency: 'RUB',
  categoryID: 1
});

// Добавить в избранное
await favoritesAPI.addFavorite(5);
```

### 3. Регистрация пользователя

```tsx
import { useAuth } from './context/AuthContext';

function RegisterExample() {
  const { register } = useAuth();

  const handleRegister = async () => {
    try {
      await register({
        fullName: 'Иван Иванов',
        phone: '+7 999 123 45 67',
        email: 'ivan@example.com',
        passwordHash: '12345'
      });
      // Автоматически залогинен
      console.log('Регистрация успешна!');
    } catch (error) {
      console.error('Ошибка регистрации:', error);
    }
  };

  return <button onClick={handleRegister}>Зарегистрироваться</button>;
}
```

### 4. Protected Route компонент

```tsx
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Загрузка...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Использование:
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
```

### 5. Загрузка объявлений с фильтрацией

```tsx
import { useState, useEffect } from 'react';
import { adsAPI } from './services/api';

function AdsList() {
  const [ads, setAds] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    loadAds();
  }, [category]);

  const loadAds = async () => {
    try {
      const response = await adsAPI.getAll({
        status: 'ACTIVE',
        categoryId: category,
        size: 20
      });
      setAds(response.data.content);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  return (
    <div>
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">Все категории</option>
        <option value="1">Коровы</option>
        <option value="2">Свиньи</option>
      </select>
      {ads.map(ad => (
        <div key={ad.id}>{ad.title} - {ad.price} {ad.currency}</div>
      ))}
    </div>
  );
}
```

---

## REST API Примеры

### Регистрация

**Request:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Иван Иванов",
    "phone": "+7 999 123 45 67",
    "email": "ivan@example.com",
    "passwordHash": "12345"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "fullName": "Иван Иванов",
    "phone": "+7 999 123 45 67",
    "email": "ivan@example.com",
    "createdAt": "2026-01-26T10:00:00Z"
  }
}
```

### Получить все объявления

**Request:**
```bash
curl -X GET "http://localhost:8080/api/ads?status=ACTIVE&categoryId=1" \
  -H "Accept: application/json"
```

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Молочные коровы",
      "description": "Высокопродуктивные коровы",
      "price": 500000,
      "currency": "RUB",
      "status": "ACTIVE",
      "seller": { /* ... */ },
      "category": { "id": 1, "name": "Коровы" },
      "location": { "city": "Москва", "region": "Московская область" },
      "views": [],
      "favoritedBy": [],
      "createdAt": "2026-01-26T10:00:00Z",
      "updatedAt": "2026-01-26T10:00:00Z"
    }
  ],
  "totalPages": 5,
  "totalElements": 45
}
```

### Создать объявление (требует токен)

**Request:**
```bash
curl -X POST http://localhost:8080/api/ads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Мои коровы",
    "description": "Очень хорошие коровы",
    "price": 450000,
    "currency": "RUB",
    "categoryID": 1,
    "locationID": 1
  }'
```

### Добавить в избранное (требует токен)

**Request:**
```bash
curl -X POST http://localhost:8080/api/favorites/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## CSS примеры

### Кастомизация цветов

Отредактируйте переменные в начале CSS файлов:

```css
/* styles/Header.css */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Измените на свои цвета */
.header {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
}
```

### Добавить новый стиль для компонента

```css
/* styles/MyComponent.css */
.my-component {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.my-component:hover {
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
```

---

## TypeScript примеры

### Создание нового интерфейса

```typescript
// types/index.ts
export interface Review {
  id: number;
  rating: number;  // 1-5
  comment: string;
  author: User;
  createdAt: string;
}
```

### Добавление типов к компоненту

```tsx
import type { ReactNode } from 'react';
import type { Ad } from '../types';

interface AdCardProps {
  ad: Ad;
  onSelect: (id: number) => void;
  children?: ReactNode;
}

export function AdCard({ ad, onSelect, children }: AdCardProps) {
  return (
    <div onClick={() => onSelect(ad.id)}>
      <h3>{ad.title}</h3>
      {children}
    </div>
  );
}
```

---

## Форма с валидацией

```tsx
import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email.includes('@')) {
      newErrors.email = 'Введите корректный email';
    }
    
    if (password.length < 5) {
      newErrors.password = 'Пароль должен быть минимум 5 символов';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      // Отправить данные
      console.log('Отправка:', { email, password });
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      {errors.email && <p className="error">{errors.email}</p>}
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
      />
      {errors.password && <p className="error">{errors.password}</p>}
      
      <button type="submit">Отправить</button>
    </form>
  );
}
```

---

## Асинхронная загрузка с обработкой ошибок

```tsx
import { useState, useEffect } from 'react';

function DataLoader() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/data');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <button onClick={loadData}>Перезагрузить</button>
    </div>
  );
}
```

---

## Модальное окно

```tsx
import { useState } from 'react';

function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Открыть модаль</button>
      
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Заголовок</h2>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              Содержимое модали
            </div>
            <div className="modal-footer">
              <button onClick={() => setIsOpen(false)}>Отмена</button>
              <button>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* CSS для модали */
const modalStyles = `
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
}
`;
```

---

## Пагинация

```tsx
import { useState } from 'react';

function Paginator({ totalPages, onPageChange }) {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  return (
    <div className="pagination">
      <button 
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Предыдущая
      </button>
      
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i + 1}
          onClick={() => handlePageChange(i + 1)}
          className={currentPage === i + 1 ? 'active' : ''}
        >
          {i + 1}
        </button>
      ))}
      
      <button 
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Следующая →
      </button>
    </div>
  );
}
```

---

## Фильтр и поиск

```tsx
import { useState, useEffect } from 'react';

function FilteredList({ items }) {
  const [filteredItems, setFilteredItems] = useState(items);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    let results = items;

    // Поиск по названию
    if (searchTerm) {
      results = results.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтр по категории
    if (selectedCategory) {
      results = results.filter(item => item.category.id === selectedCategory);
    }

    setFilteredItems(results);
  }, [searchTerm, selectedCategory, items]);

  return (
    <>
      <input
        type="text"
        placeholder="Поиск..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">Все категории</option>
        {/* Опции категорий */}
      </select>
      
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </>
  );
}
```

---

## Таймер обратного отсчета

```tsx
import { useState, useEffect } from 'react';

function Countdown({ initialSeconds = 60 }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds(s => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  return (
    <div>
      <p>Осталось {seconds} секунд</p>
      {seconds === 0 && <p>Время истекло!</p>}
    </div>
  );
}
```

---

## Local Storage примеры

```tsx
// Сохранение токена
localStorage.setItem('authToken', token);

// Получение токена
const token = localStorage.getItem('authToken');

// Удаление токена
localStorage.removeItem('authToken');

// Очистка всего
localStorage.clear();

// Проверка наличия
if (localStorage.getItem('authToken')) {
  console.log('Пользователь авторизован');
}
```

---

## Окончание примеров

Для большего числа примеров смотрите исходный код в папке `src/components`.

**Удачи в разработке! 🚀**
