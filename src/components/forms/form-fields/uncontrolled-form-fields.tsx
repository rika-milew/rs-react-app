import classNames from 'classnames/bind';
import { GENDER_OPTIONS, COUNTRIES } from '@/constants/constants';
import { ImageUpload } from './image-upload';
import styles from './form-fields.module.css';

const cx = classNames.bind(styles);

type FormFieldsProps = {
  errors?: {
    name?: string;
    age?: string;
    email?: string;
    gender?: string;
    password?: string;
    confirmPassword?: string;
    image?: string;
    terms?: string;
    country?: string;
  };
};

export function UncontrolledFormFields({ errors = {} }: FormFieldsProps) {
  return (
    <div className={cx('form-fields')}>
      <div className={cx('field', { error: !!errors.name })}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" defaultValue="" required />
        {errors.name && (
          <span className={cx('error-message')}>{errors.name}</span>
        )}
      </div>
      <div className={cx('field', { error: !!errors.age })}>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          name="age"
          type="number"
          defaultValue=""
          min={0}
          required
        />
        {errors.age && (
          <span className={cx('error-message')}>{errors.age}</span>
        )}
      </div>
      <div className={cx('field', { error: !!errors.gender })}>
        <label htmlFor="gender">Gender</label>
        <select id="gender" name="gender" defaultValue="" required>
          <option value="" disabled>
            Select gender
          </option>
          {GENDER_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.gender && (
          <span className={cx('error-message')}>{errors.gender}</span>
        )}
      </div>
      <div className={cx('field', { error: !!errors.email })}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" defaultValue="" required />
        {errors.email && (
          <span className={cx('error-message')}>{errors.email}</span>
        )}
      </div>
      <div className={cx('field', { error: !!errors.password })}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          defaultValue=""
          required
        />
        {errors.password && (
          <span className={cx('error-message')}>{errors.password}</span>
        )}
      </div>
      <div className={cx('field', { error: !!errors.confirmPassword })}>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          defaultValue=""
          required
        />
        {errors.confirmPassword && (
          <span className={cx('error-message')}>{errors.confirmPassword}</span>
        )}
      </div>

      <ImageUpload name="image" error={errors.image} />

      <div className={cx('field', { error: !!errors.country })}>
        <label htmlFor="country">Country</label>
        <select id="country" name="country" defaultValue="" required>
          <option value="" disabled>
            Select country
          </option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.country && (
          <span className={cx('error-message')}>{errors.country}</span>
        )}
      </div>
      <div className={cx('checkbox-field', { error: !!errors.terms })}>
        <div className={cx('checkbox')}>
          <input
            id="terms"
            name="terms"
            type="checkbox"
            defaultChecked={false}
          />
          <label htmlFor="terms">Accept Terms & Conditions</label>
        </div>
        {errors.terms && (
          <span className={cx('error-message')}>{errors.terms}</span>
        )}
      </div>
    </div>
  );
}
