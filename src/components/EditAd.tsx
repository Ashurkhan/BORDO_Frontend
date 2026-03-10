import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adsAPI, categoriesAPI, imagesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ImageUpload } from './ImageUpload';
import type { AdUpdateRequest, Category, LocationRequest, ImageResponse } from '../types';
import '../styles/CreateAd.css';

export const EditAd = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const adId = id ? parseInt(id) : null;

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [images, setImages] = useState<ImageResponse[]>([]);

  const [formData, setFormData] = useState<AdUpdateRequest>({
    title: '',
    description: '',
    price: 0,
    currency: 'RUB',
    categoryId: 0,
    location: {
      street: '',
      village: '',
      city: '',
      region: '',
      country: 'Россия',
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    try {
      setIsLoadingData(true);
      const catsRes = await categoriesAPI.getAll();
      console.log('Категории загружены:', catsRes.data);
      setCategories(catsRes.data);
      
      if (!adId) {
        setError('ID объявления не найден');
        setIsLoadingData(false);
        return;
      }

      const adRes = await adsAPI.getById(adId);
      const imagesRes = await imagesAPI.getImagesByAd(adId);
      console.log('Объявление загружено:', adRes.data);
      console.log('Изображения загружены:', imagesRes.data);
      setImages(imagesRes.data);
      
      setFormData({
        title: adRes.data.title || '',
        description: adRes.data.description || '',
        price: adRes.data.price || 0,
        currency: adRes.data.currency || 'RUB',
        categoryId: adRes.data.category.id,
        location: {
          street: adRes.data.location.street || '',
          village: adRes.data.location.village || '',
          city: adRes.data.location.city || '',
          region: adRes.data.location.region || '',
          country: adRes.data.location.country || 'Россия',
        },
      });
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setError('Не удалось загрузить объявление');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.replace('location.', '') as keyof LocationRequest;
      setFormData(prev => ({
        ...prev,
        location: {
          ...(prev.location || {}),
          [locationField]: value,
        } as LocationRequest,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'price' ? parseFloat(value) || 0 : name === 'categoryId' ? parseInt(value) || 0 : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!adId) {
      setError('ID объявления не найден');
      return;
    }

    if (!formData.title || !formData.description || (formData.price || 0) <= 0 || !formData.categoryId) {
      setError('Заполните все обязательные поля');
      return;
    }

    if (!formData.location?.city || !formData.location?.region) {
      setError('Укажите город и регион');
      return;
    }

    try {
      setIsLoading(true);
      await adsAPI.update(adId, formData);
      navigate(`/ads/${adId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка обновления объявления');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return <div className="create-ad-page"><div className="create-ad-container"><p>Загрузка...</p></div></div>;
  }

  return (
    <div className="create-ad-page">
      <div className="create-ad-container">
        <h1>Редактировать объявление</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="create-ad-form">
          <div className="form-group">
            <label htmlFor="title">Название объявления *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              placeholder="Например: Молочные коровы голштинской породы"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Подробное описание скота..."
              rows={6}
              required
            />
          </div>

          {adId && (
            <ImageUpload
              adId={adId}
              images={images}
              onImagesChange={setImages}
            />
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoryId">Категория *</label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId || ''}
                onChange={handleChange}
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location.city">Город *</label>
              <input
                id="location.city"
                type="text"
                name="location.city"
                value={formData.location?.city || ''}
                onChange={handleChange}
                placeholder="Москва"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location.region">Регион *</label>
              <input
                id="location.region"
                type="text"
                name="location.region"
                value={formData.location?.region || ''}
                onChange={handleChange}
                placeholder="Московская область"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location.street">Улица</label>
              <input
                id="location.street"
                type="text"
                name="location.street"
                value={formData.location?.street || ''}
                onChange={handleChange}
                placeholder="Примерная улица, 123"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location.village">Деревня</label>
              <input
                id="location.village"
                type="text"
                name="location.village"
                value={formData.location?.village || ''}
                onChange={handleChange}
                placeholder="Название деревни"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location.country">Страна</label>
              <input
                id="location.country"
                type="text"
                name="location.country"
                value={formData.location?.country || ''}
                onChange={handleChange}
                placeholder="Россия"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Цена *</label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price || 0}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">Валюта</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency || 'RUB'}
                onChange={handleChange}
              >
                <option value="RUB">Рубли (₽)</option>
                <option value="USD">Доллары ($)</option>
                <option value="EUR">Евро (€)</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isLoading} className="submit-button">
              {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate(-1)}
            >
              Отменить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
