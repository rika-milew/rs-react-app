import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import classNames from 'classnames/bind';
import styles from './field.module.css';

const cx = classNames.bind(styles);

type ImageUploadProps = {
  name: string;
  error?: string;
  onChange?: (file: File | undefined) => void;
};

export function ImageUpload({ name, error, onChange }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImage(null);
      onChange?.(undefined);
      return;
    }

    onChange?.(file);

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  };

  return (
    <div className={cx('field', { error: !!error })}>
      <label htmlFor={name}>Profile Image</label>
      <input
        id={name}
        name={name}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleImageChange}
      />
      {image && (
        <div className={cx('image-preview')}>
          <img src={image} alt="Preview" />
        </div>
      )}
      {error && <span className={cx('error-message')}>{error}</span>}
    </div>
  );
}
