import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  UserRequest,
  UserCredentialsDto,
  UserResponse,
  JwtAuthenticationDto,
  RefreshTokenDto,
  AdRequest,
  AdUpdateRequest,
  AdResponse,
  Category,
  Location,
  // vote types
  AdVoteRequest,
  VoteCounts,
  ImageResponse,
  UserUpdate,
  ChatResponse,
  MessageResponse,
  MessageRequest,
} from '../types';

// В dev используем прокси (обход CORS), в prod — полный URL
const API_BASE_URL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:8080/api');

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем accessToken в заголовки если он есть
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка 401: пробуем refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (token: string | null, err: unknown = null) => {
  failedQueue.forEach((prom) => (err ? prom.reject(err) : prom.resolve(token!)));
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        isRefreshing = false;
        localStorage.removeItem('accessToken');
        processQueue(null, err);
        return Promise.reject(err);
      }
      try {
        const { data } = await apiClient.post<JwtAuthenticationDto>('/auth/refresh', { refreshToken });
        localStorage.setItem('accessToken', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        processQueue(data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(null, refreshErr);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

// Auth API (под бэкенд AuthController)
export const authAPI = {
  signUp: (data: UserRequest) => apiClient.post<UserResponse>('/auth/signUp', data),
  signIn: (data: UserCredentialsDto) => apiClient.post<JwtAuthenticationDto>('/auth/signIn', data),
  refresh: (data: RefreshTokenDto) => apiClient.post<JwtAuthenticationDto>('/auth/refresh', data),
  resendVerification: (email: string) =>
    apiClient.post<string>('/auth/resend-verification', null, { params: { email } }),
};

// Users API (под бэкенд UserController)
export const usersAPI = {
  // текущий авторизованный пользователь: GET /api/users/me
  me: () => apiClient.get<UserResponse>('/users/me'),
  // при необходимости можно оставить и поиск по id
  getById: (id: number) => apiClient.get<UserResponse>(`/users/${id}`),
  update: (id: number, data: UserUpdate) =>
    apiClient.put<UserResponse>(`/users/update/${id}`, data),
};

// Ads API
export const adsAPI = {
  getAll: (params?: { status?: string; categoryId?: number; page?: number; size?: number }) =>
    apiClient.get<{ content: AdResponse[]; totalPages: number; totalElements: number }>('/ad/getAll', { params }),
  getById: (id: number) => apiClient.get<AdResponse>(`/ad/get/${id}`),
  create: (data: AdRequest) => apiClient.post<AdResponse>('/ad/create', data),
  update: (id: number, data: AdUpdateRequest) => apiClient.patch<AdResponse>(`/ad/update/${id}`, data),
  delete: (id: number) => apiClient.delete(`/ad/delete/${id}`),
  getByUserId: (userId: number) => apiClient.get<AdResponse[]>(`/ad/user/${userId}`),
  getBySeller: () => apiClient.get<AdResponse[]>('/ad/getBySeller'),
  addView: (adId: number, viewerId?: number) =>
    apiClient.post(`/ads/view/${adId}`, null, { params: viewerId ? { viewerId } : {} }),
  getViewsCount: (adId: number) =>
    apiClient.get<number>(`/ads/view/${adId}/count`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiClient.get<Category[]>('/category/categories'),
  getById: (id: number) => apiClient.get<Category>(`/category/categories/${id}`),
};

// Locations API
export const locationsAPI = {
  getAll: () => apiClient.get<Location[]>('/locations'),
  getById: (id: number) => apiClient.get<Location>(`/locations/${id}`),
};

// Favorites API
// Favorites API (backend: /api/favorite)
export const favoritesAPI = {
  addFavorite: (adId: number) => apiClient.post('/favorite/add', { adId }),
  removeFavorite: (adId: number) => apiClient.delete(`/favorite/remove/${adId}`),
  list: () => apiClient.get<AdResponse[]>('/favorite'),
};

// Images API
export const imagesAPI = {
  uploadImage: (adId: number, file: File, main: boolean = false) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('main', main.toString());
    return apiClient.post<ImageResponse>(`/images/ad/${adId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateImage: (imageId: number, main: boolean) =>
    apiClient.put<ImageResponse>(`/images/${imageId}`, { main }),
  deleteImage: (imageId: number) => apiClient.delete(`/images/${imageId}`),
  getImagesByAd: (adId: number) => apiClient.get<ImageResponse[]>(`/images/ad/${adId}`),
};

// Votes API
export const votesAPI = {
  vote: (data: AdVoteRequest) => apiClient.post('/ads/vote', data),
  getCounts: (adId: number) => apiClient.get<VoteCounts>(`/ads/vote/${adId}`),
  // get current user's liked ads (returns full AdResponse objects)
};

// Chat API
export const chatAPI = {
  openChat: (adId: number) => apiClient.post<ChatResponse>('/chats/open', null, { params: { adId } }),
  sendMessage: (data: MessageRequest) => apiClient.post<MessageResponse>('/chats/message', data),
  markAsRead: (chatId: number) => apiClient.post(`/chats/${chatId}/read`),
  deleteMessage: (messageId: number) => apiClient.delete(`/chats/message/${messageId}`),
  getMessages: (chatId: number, page: number = 0, size: number = 20) =>
    apiClient.get<{ content: MessageResponse[]; totalElements: number; totalPages: number }>(`/chats/${chatId}/messages`, {
      params: { page, size },
    }),
  // user chat list endpoint is missing from the controller, assume it's /chats for now or we will see if we need it
  getUserChats: () => apiClient.get<ChatResponse[]>('/chats'),
};

export default apiClient;
