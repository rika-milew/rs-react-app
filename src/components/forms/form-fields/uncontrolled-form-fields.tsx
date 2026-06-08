import classNames from 'classnames/bind';
import { GENDER_OPTIONS } from '@/constants/constants';
import { CountryAutocomplete } from '@/components/country-autocomplete/country-autocomplete';
import { ImageUpload } from './image-upload';
import { PasswordIndicator } from '@/components/password-indicator/password-indicator';
import { useState } from 'react';
import { Field } from './field';
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
  const [password, setPassword] = useState('');
  return (
    <div className={cx('form-fields')}>
      <Field id="name" label="Name" error={errors.name}>
        <input id="name" name="name" type="text" defaultValue="" required />
      </Field>
      <Field id="age" label="Age" error={errors.age}>
        <input
          id="age"
          name="age"
          type="number"
          defaultValue=""
          min={0}
          required
        />
      </Field>
      <Field id="gender" label="Gender" error={errors.gender}>
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
      </Field>
      <Field id="email" label="Email" error={errors.email}>
        <input id="email" name="email" type="email" defaultValue="" required />
      </Field>
      <Field id="password" label="Password" error={errors.password}>
        <input
          id="password"
          name="password"
          type="password"
          defaultValue=""
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <PasswordIndicator password={password} />
      </Field>
      <Field
        id="confirmPassword"
        label="Confirm Password"
        error={errors.confirmPassword}
      >
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          defaultValue=""
          required
        />
      </Field>
      <ImageUpload name="image" error={errors.image} />
      <Field id="country" label="Country" error={errors.country}>
        <CountryAutocomplete name="country" error={errors.country} />
      </Field>
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
        <span className={cx('error-message')}>{errors.terms ?? ''}</span>
      </div>
    </div>
  );
}
