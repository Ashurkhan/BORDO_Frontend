// User и Auth типы (под бэкенд AuthController)
export interface UserRequest {
  fullName: string;
  phone: string;
  email: string;
  passwordHash: string;
}

// UserCredentialsDto для signIn
export interface UserCredentialsDto {
  email: string;
  password: string;
}

export interface User {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  createdAt?: string;
}

// Обновление пользователя (частичные поля)
export interface UserUpdate {
  fullName?: string;
  phone?: string;
  email?: string;
}

// JwtAuthenticationDto - ответ signIn и refresh (бэкенд: token, refreshToken)
export interface JwtAuthenticationDto {
  token: string;
  refreshToken: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// UserResponse - ответ signUp (только данные юзера, без токенов)
export type UserStatus = string;
export type UserRole = string;

export interface UserResponse {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  status: UserStatus;
  role: UserRole;
  favorites?: unknown[];
  createdAt: string;
  updatedAt: string;
}

// RefreshTokenDto - для /auth/refresh
export interface RefreshTokenDto {
  refreshToken: string;
}

// Ad (Объявление) типы
export type AdStatus = 'ACTIVE' | 'SOLD' | 'INACTIVE';

export interface Category {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  street?: string;
  village?: string;
  city: string;
  region: string;
  country?: string;
}

export interface LocationRequest {
  street?: string;
  village?: string;
  city: string;
  region: string;
  country?: string;
}

export interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
}

export interface SubCategoryRequest {
  name: string;
}

export interface AdView {
  id: number;
  viewedAt: string;
}

export interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  status: AdStatus;
  views: AdView[];
  seller: User;
  category: Category;
  location: Location;
  favoritedBy: Favorite[];
  images?: ImageResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface AdRequest {
  title: string;
  description: string;
  price: number;
  currency: string;
  categoryId: number;
  subCategory?: SubCategoryRequest;
  location: LocationRequest;
}

export interface AdUpdateRequest {
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  categoryId?: number;
  subCategory?: SubCategoryRequest;
  location?: LocationRequest;
}

export interface AdResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  status: AdStatus;
  views: AdView[];
  seller: User;
  category: Category;
  subCategory?: SubCategory;
  location: Location;
  favoritedBy: Favorite[];
  images?: ImageResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ImageResponse {
  id: number;
  url: string;
  main: boolean;
  createdAt: string;
}

export interface Favorite {
  id: number;
  userId: number;
  adId: number;
  createdAt: string;
}

// Voting types
export type AdVoteType = 'LIKE' | 'DISLIKE';

export interface AdVoteRequest {
  adId: number;
  type: AdVoteType;
  remove?: boolean;
}

export interface VoteCounts {
  likes: number;
  dislikes: number;
}

// Chat types
export interface ChatResponse {
  id: number;
  adId: number;
  adTitle: string;
  adImageUrl?: string;
  buyerId: number;
  sellerId: number;
  buyerName: string;
  sellerName: string;
  createdAt: string;
  updatedAt: string;
  messages?: MessageResponse[];
  unreadCount?: number;
}

export interface MessageResponse {
  id: number;
  chatId: number;
  senderId: number;
  senderFullName: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface MessageRequest {
  chatId: number;
  content: string;
}
