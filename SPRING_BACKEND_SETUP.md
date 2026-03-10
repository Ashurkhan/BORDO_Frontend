# 🔧 Подготовка Spring Backend для Bordo

Это руководство для вашего **отдельного Spring Backend проекта** (не в этом репозитории).

## 📁 Структура проектов

```
C:\Users\User\Desktop\
├── intern_react/                     ← React Frontend (этот проект)
│   └── college/
│       ├── src/, package.json, ...
│       └── npm run dev → localhost:5173
│
└── ваш-spring-проект/                ← Ваш отдельный Spring Backend
    ├── src/main/java/
    ├── pom.xml
    └── mvn spring-boot:run → localhost:8080
```

---

## 🎯 Минимальные требования для Backend

Ваш Spring Backend должен реализовать следующее:

### 1. CORS конфигурация (ОБЯЗАТЕЛЬНО!)

Добавьте конфигурацию CORS в ваше Spring приложение:

```java
package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
```

### 2. Controller базовый пример

Вот примеры контроллеров для Bordo:

#### AuthController

```java
package com.example.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.dto.UserRequest;
import com.example.dto.LoginRequest;
import com.example.dto.AuthResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UserRequest request) {
        // Ваша логика регистрации
        // 1. Валидировать данные
        // 2. Хешировать пароль
        // 3. Сохранить пользователя в БД
        // 4. Генерировать JWT токен
        // 5. Вернуть токен и пользователя
        
        return ResponseEntity.ok(new AuthResponse(token, user));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Ваша логика входа
        // 1. Найти пользователя по email
        // 2. Проверить пароль
        // 3. Генерировать JWT токен
        // 4. Вернуть токен и пользователя
        
        return ResponseEntity.ok(new AuthResponse(token, user));
    }
    
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String token) {
        // Ваша логика получения текущего пользователя
        // 1. Извлечь token из Authorization заголовка
        // 2. Валидировать token
        // 3. Получить пользователя из token
        // 4. Вернуть пользователя
        
        return ResponseEntity.ok(user);
    }
}
```

#### AdController

```java
package com.example.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.model.Ad;
import com.example.dto.AdRequest;

@RestController
@RequestMapping("/api/ads")
public class AdController {
    
    @GetMapping
    public ResponseEntity<Page<Ad>> getAllAds(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) Long categoryId,
        Pageable pageable
    ) {
        // Ваша логика получения объявлений с фильтрацией
        return ResponseEntity.ok(ads);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Ad> getAd(@PathVariable Long id) {
        // Ваша логика получения одного объявления
        return ResponseEntity.ok(ad);
    }
    
    @PostMapping
    public ResponseEntity<Ad> createAd(
        @RequestHeader("Authorization") String token,
        @RequestBody AdRequest request
    ) {
        // Ваша логика создания объявления
        // 1. Получить текущего пользователя из token
        // 2. Создать новое объявление
        // 3. Сохранить в БД
        // 4. Вернуть созданное объявление
        
        return ResponseEntity.status(201).body(ad);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Ad> updateAd(
        @PathVariable Long id,
        @RequestHeader("Authorization") String token,
        @RequestBody AdRequest request
    ) {
        // Ваша логика обновления объявления
        return ResponseEntity.ok(updatedAd);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAd(
        @PathVariable Long id,
        @RequestHeader("Authorization") String token
    ) {
        // Ваша логика удаления объявления
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Ad>> getUserAds(@PathVariable Long userId) {
        // Ваша логика получения объявлений пользователя
        return ResponseEntity.ok(ads);
    }
}
```

#### CategoryController

```java
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategory(@PathVariable Long id) {
        return ResponseEntity.ok(category);
    }
}
```

#### LocationController

```java
@RestController
@RequestMapping("/api/locations")
public class LocationController {
    
    @GetMapping
    public ResponseEntity<List<Location>> getAllLocations() {
        return ResponseEntity.ok(locations);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocation(@PathVariable Long id) {
        return ResponseEntity.ok(location);
    }
}
```

#### FavoriteController

```java
@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    
    @PostMapping("/{adId}")
    public ResponseEntity<?> addFavorite(
        @PathVariable Long adId,
        @RequestHeader("Authorization") String token
    ) {
        // Добавить объявление в избранное
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{adId}")
    public ResponseEntity<?> removeFavorite(
        @PathVariable Long adId,
        @RequestHeader("Authorization") String token
    ) {
        // Удалить объявление из избранного
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/my")
    public ResponseEntity<List<Ad>> getMyFavorites(
        @RequestHeader("Authorization") String token
    ) {
        // Получить избранные объявления текущего пользователя
        return ResponseEntity.ok(favorites);
    }
}
```

### 3. DTO классы

```java
// AuthResponse
public class AuthResponse {
    private String token;
    private User user;
    
    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }
    // getters
}

// UserRequest
public class UserRequest {
    private String fullName;
    private String phone;
    private String email;
    private String passwordHash; // 5-8 символов
    
    // getters, setters
}

// LoginRequest
public class LoginRequest {
    private String email;
    private String passwordHash;
    
    // getters, setters
}

// AdRequest
public class AdRequest {
    private String title;
    private String description;
    private BigDecimal price;
    private String currency;
    private Long categoryID;
    private Long locationID;
    
    // getters, setters
}
```

---

## 🗄️ Entity классы (JPA)

```java
// User
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String passwordHash;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // getters, setters
}

// Ad
@Entity
@Table(name = "ads")
public class Ad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    private String currency;
    
    @Enumerated(EnumType.STRING)
    private AdStatus status; // ACTIVE, SOLD, INACTIVE
    
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    
    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;
    
    @OneToMany(mappedBy = "ad", cascade = CascadeType.ALL)
    private Set<AdView> views = new HashSet<>();
    
    @OneToMany(mappedBy = "ad", cascade = CascadeType.ALL)
    private Set<Favorite> favoritedBy = new HashSet<>();
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        status = AdStatus.ACTIVE;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // getters, setters
}

// Category
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    // getters, setters
}

// Location
@Entity
@Table(name = "locations")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String city;
    
    @Column(nullable = false)
    private String region;
    
    // getters, setters
}

// AdView
@Entity
@Table(name = "ad_views")
public class AdView {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "ad_id")
    private Ad ad;
    
    @Column(nullable = false)
    private LocalDateTime viewedAt;
    
    @PrePersist
    protected void onCreate() {
        viewedAt = LocalDateTime.now();
    }
    
    // getters, setters
}

// Favorite
@Entity
@Table(name = "favorites")
public class Favorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "ad_id")
    private Ad ad;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // getters, setters
}
```

---

## 🔐 JWT токены

Для аутентификации используйте JWT. Пример с Spring Security:

```xml
<!-- pom.xml -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.11.5</version>
</dependency>
```

```java
// JwtTokenProvider
@Component
public class JwtTokenProvider {
    
    @Value("${jwt.secret:your-secret-key}")
    private String jwtSecret;
    
    @Value("${jwt.expiration:3600000}")
    private long jwtExpirationInMs;
    
    public String generateToken(User user) {
        return Jwts.builder()
            .setSubject(Long.toString(user.getId()))
            .claim("email", user.getEmail())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }
    
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody();
        return Long.parseLong(claims.getSubject());
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

---

## 📋 Чек-лист для подготовки Backend

- [ ] Создана CORS конфигурация
- [ ] Реализованы все 5 Controllers (Auth, Ad, Category, Location, Favorite)
- [ ] Созданы Entity классы согласно Bordo структуре
- [ ] Созданы DTO классы (UserRequest, LoginRequest, AdRequest, AuthResponse)
- [ ] Реализована валидация данных
- [ ] Реализована JWT аутентификация
- [ ] Реализованы Repository классы (JPA)
- [ ] Реализованы Service классы (бизнес логика)
- [ ] Backend запускается без ошибок (`mvn spring-boot:run`)
- [ ] API endpoints доступны по адресу `http://localhost:8080/api`
- [ ] CORS работает (можно отправлять запросы с фронтенда)

---

## 🚀 Запуск Spring Backend

```bash
# Убедитесь что Java и Maven установлены
java -version
mvn --version

# Перейдите в папку проекта
cd path/to/your/spring/project

# Запустите сервер
mvn spring-boot:run

# Вы должны увидеть:
# Started YourApplication in X.XXX seconds
```

Backend будет доступен на: `http://localhost:8080`

---

## ✅ Проверка что все работает

```bash
# 1. Проверьте регистрацию
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "phone": "+7 999 999 99 99",
    "email": "test@example.com",
    "passwordHash": "12345"
  }'

# 2. Проверьте получение категорий
curl -X GET http://localhost:8080/api/categories

# 3. Проверьте CORS
# Откройте браузер на http://localhost:5173
# Откройте консоль (F12)
# Попробуйте зарегистрироваться
```

---

## 📞 Помощь

Если возникли проблемы:

1. Проверьте логи Spring для ошибок
2. Убедитесь что CORS конфигурирован
3. Смотрите [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) для полной документации
4. Проверьте что все endpoints реализованы согласно требованиям

---

**Готово! Теперь можно запустить Frontend! 🚀**
