import classNames from 'classnames/bind';
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from 'react-hook-form';
import { GENDER_OPTIONS, COUNTRIES } from '@/constants/constants';
import type { FormValues } from '@/types/form-types';
import styles from './form-fields.module.css';
import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';

const cx = classNames.bind(styles);

type ControlledFormFieldsProps = {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  imageFile: File | undefined;
};

export function ControlledFormFields({
  register,
  errors,
  setValue,
  imageFile,
}: ControlledFormFieldsProps) {
  return (
    <div className={cx('form-fields')}>
      <div className={cx('field', { error: !!errors.name })}>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" {...register('name')} required />
        {errors.name && (
          <span className={cx('error-message')}>{errors.name.message}</span>
        )}
      </div>
      <div className={cx('field', { error: !!errors.age })}>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          {...register('age', { valueAsNumber: true })}
          required
        />
        {errors.age && (
          <span className={cx('error-message')}>{errors.age.message}</span>
        )}
      </div>
      <div className={cx('field', { error: !!errors.gender })}>
        <label htmlFor="gender">Gender</label>
        <select id="gender" {...register('gender')} required>
          <option value="" disabled>
            Select gender
          </option>
          {GENDER_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
          {errors.gender && (
            <span className={cx('error-message')}>{errors.gender.message}</span>
          )}
        </select>
      </div>
      <div className={cx('field', { error: !!errors.email })}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} required />
        {errors.email && (
          <span className={cx('error-message')}>{errors.email.message}</span>
        )}
      </div>
      <div className={cx('field', { error: !!errors.password })}>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register('password')} />
        {/* <PasswordIndicator password={watch('password')} /> */}
        {errors.password && (
          <span className={cx('error-message')}>{errors.password.message}</span>
        )}
      </div>
      <div className={cx('field', { error: !!errors.confirmPassword })}>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span className={cx('error-message')}>
            {errors.confirmPassword.message}
          </span>
        )}
      </div>
      <ImageUpload setValue={setValue} errors={errors} imageFile={imageFile} />
      <div className={cx('field', { error: !!errors.country })}>
        <label htmlFor="country">Country</label>
        <select id="country" {...register('country')}>
          <option value="">Select country</option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.country && (
          <span className={cx('error-message')}>{errors.country.message}</span>
        )}
      </div>
      <div className={cx('checkbox-field', { error: !!errors.terms })}>
        <input id="terms" type="checkbox" {...register('terms')} />
        <label htmlFor="terms">Accept Terms & Conditions</label>
        {errors.terms && (
          <span className={cx('error-message')}>{errors.terms.message}</span>
        )}
      </div>
    </div>
  );
}

type ImageUploadProps = {
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
  imageFile?: File;
};

export function ImageUpload({ setValue, errors }: ImageUploadProps) {
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
      return;
    }

    setValue('image', file);

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  };

  return (
    <div className={cx('field', { error: !!errors.image })}>
      <label htmlFor="image">Profile Image</label>
      <input
        id="image"
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleImageChange}
      />
      {image && (
        <div className={cx('image-preview')}>
          <img src={image} alt="Preview" />
        </div>
      )}
      {errors.image?.message && (
        <span className={cx('error-message')}>{errors.image.message}</span>
      )}
    </div>
  );
}
