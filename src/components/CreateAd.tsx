import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adsAPI, categoriesAPI, imagesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ImageUpload } from './ImageUpload';
import type { AdRequest, Category, LocationRequest, ImageResponse } from '../types';
import '../styles/CreateAd.css';

export const CreateAd = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<ImageResponse[]>([]);
  const [createdAdId, setCreatedAdId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<AdRequest>({
    title: '',
    description: '',
    price: 0,
    currency: 'Сом',
    categoryId: 0,
    location: {
      street: '',
      village: '',
      city: '',
      region: '',
      country: 'Кыргызстан',
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
      const catsRes = await categoriesAPI.getAll();
      console.log('Категории загружены:', catsRes.data);
      setCategories(catsRes.data);
      if (catsRes.data.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: catsRes.data[0].id }));
      }
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
      setError('Ошибка загрузки категорий');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const allowed = Array.from(files).slice(0, 5 - selectedFiles.length);
    const valid: File[] = [];
    const newPreviews: string[] = [];

    for (const file of allowed) {
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) continue;
      if (file.size > 5 * 1024 * 1024) continue;
      valid.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setSelectedFiles(prev => [...prev, ...valid].slice(0, 5));
    setPreviews(prev => [...prev, ...newPreviews].slice(0, 5));
    // reset input
    if (e.target) e.target.value = '';
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
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
          ...prev.location,
          [locationField]: value,
        },
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

    if (!formData.title || !formData.description || formData.price <= 0 || !formData.categoryId) {
      setError('Заполните все обязательные поля');
      return;
    }

    if (!formData.location.city || !formData.location.region) {
      setError('Укажите город и регион');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Отправляем данные:', formData);
      const response = await adsAPI.create(formData);
      console.log('Объявление создано:', response.data);
      const newAdId = response.data.id;
      setCreatedAdId(newAdId);

      // If user selected files before creation, upload them now
      if (selectedFiles.length > 0) {
        try {
          for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const isMain = i === 0; // first selected becomes main
            await imagesAPI.uploadImage(newAdId, file, isMain);
          }
          const imgs = await imagesAPI.getImagesByAd(newAdId);
          setImages(imgs.data || []);
        } catch (uploadErr) {
          console.error('Ошибка загрузки изображений:', uploadErr);
        }
      }

      setTimeout(() => {
        navigate(`/ads/${newAdId}`);
      }, 800);
    } catch (err: any) {
      console.error('Ошибка создания:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Ошибка создания объявления');
      setCreatedAdId(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-ad-page">
      <div className="create-ad-container">
        <h1>Создать новое объявление</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="create-ad-form">
          <div className="form-group">
            <label htmlFor="title">Название объявления *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Например: Молочные коровы голштинской породы"
              required
              disabled={createdAdId !== null}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Подробное описание скота..."
              rows={6}
              required
            />
          </div>

          <div className="form-group">
            <label>Фото (до 5, jpg/png/gif/webp, до 5MB каждая)</label>
            <input type="file" accept="image/*" multiple onChange={handleFileSelect} disabled={createdAdId !== null} />
            {previews.length > 0 && (
              <div className="photo-previews">
                {previews.map((p, idx) => (
                  <div key={idx} className="preview-card">
                    <img src={p} alt={`preview-${idx}`} />
                    <button type="button" className="remove-preview" onClick={() => removeSelectedFile(idx)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {createdAdId && (
            <ImageUpload
              adId={createdAdId}
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
                value={formData.categoryId}
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
                value={formData.location.city}
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
                value={formData.location.region}
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
                value={formData.location.street}
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
                value={formData.location.village}
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
                value={formData.location.country}
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
                value={formData.price}
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
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="RUB">Сом (KGS)</option>
                <option value="USD">Доллары ($)</option>
                <option value="EUR">Евро (€)</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isLoading} className="submit-button">
              {isLoading ? 'Создание...' : 'Создать объявление'}
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate('/profile')}
            >
              Отменить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
