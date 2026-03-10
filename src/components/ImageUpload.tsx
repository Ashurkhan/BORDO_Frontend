import { useState } from 'react';
import { imagesAPI } from '../services/api';
import type { ImageResponse } from '../types';
import '../styles/ImageUpload.css';

interface ImageUploadProps {
  adId: number;
  onImagesChange: (images: ImageResponse[]) => void;
  images: ImageResponse[];
}

export const ImageUpload = ({ adId, onImagesChange, images }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const MAX_IMAGES = 5;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    setError('');

    if (images.length >= MAX_IMAGES) {
      setError(`Максимум ${MAX_IMAGES} фотографий на объявление`);
      return;
    }

    const file = files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Допустимые форматы: JPEG, PNG, GIF, WEBP');
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      setError('Размер фото не должен превышать 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const isMain = images.length === 0; // Первое фото - главное
      const response = await imagesAPI.uploadImage(adId, file, isMain);
      onImagesChange([...images, response.data]);
      e.currentTarget.value = ''; // Чистим input
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки фото');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetMain = async (imageId: number) => {
    try {
      await imagesAPI.updateImage(imageId, true);
      const updated = images.map(img => ({
        ...img,
        main: img.id === imageId,
      }));
      onImagesChange(updated);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка обновления фото');
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!confirm('Удалить фото?')) return;

    try {
      await imagesAPI.deleteImage(imageId);
      onImagesChange(images.filter(img => img.id !== imageId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка удаления фото');
    }
  };

  return (
    <div className="image-upload-container">
      <h3>Фотографии объявления</h3>
      
      {error && <div className="error-message">{error}</div>}

      <div className="upload-section">
        <label htmlFor="image-input" className="upload-label">
          <div className="upload-box">
            <span className="upload-icon">+</span>
            <p>Загрузить фото</p>
            <span className="upload-hint">({images.length}/{MAX_IMAGES})</span>
          </div>
          <input
            id="image-input"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            disabled={isUploading || images.length >= MAX_IMAGES}
            className="file-input"
          />
        </label>
      </div>

      {isUploading && <p className="loading">Загрузка...</p>}

      {images.length > 0 && (
        <div className="images-grid">
          {images.map(image => (
            <div key={image.id} className="image-item">
              <div className="image-wrapper">
                <img src={image.url} alt="Фото объявления" className="image-preview" />
                {image.main && <span className="main-badge">Главное</span>}
              </div>
              <div className="image-actions">
                {!image.main && (
                  <button
                    type="button"
                    className="btn-small"
                    onClick={() => handleSetMain(image.id)}
                  >
                    Сделать главным
                  </button>
                )}
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => handleDelete(image.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
