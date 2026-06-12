import classNames from 'classnames/bind';
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
  UseFormTrigger,
} from 'react-hook-form';
import { GENDER_OPTIONS } from '@/constants/constants';
import type { FormValues } from '@/types/form-types';
import { ImageUpload } from '../image-upload/image-upload';
import { CountryAutocomplete } from '@/components/country-autocomplete/country-autocomplete';
import { PasswordIndicator } from '@/components/password-indicator/password-indicator';
import { Field } from '../field/field';

import styles from '../form-fields.module.css';

const cx = classNames.bind(styles);

export type ControlledFormFieldsProps = {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  watch: UseFormWatch<FormValues>;
  trigger: UseFormTrigger<FormValues>;
};

export function ControlledFormFields({
  register,
  errors,
  setValue,
  watch,
  trigger,
}: ControlledFormFieldsProps) {
  const password = watch('password');

  const handleCountryChange = (value: string) => {
    setValue('country', value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    void trigger('image').catch((error: unknown) => {
      console.error('Validation error for image field:', error);
    });
  };

  return (
    <div className={cx('form-fields')}>
      <Field id="name" label="Name" error={errors.name?.message}>
        <input id="name" type="text" {...register('name')} required />
      </Field>
      <Field id="age" label="Age" error={errors.age?.message}>
        <input
          id="age"
          type="number"
          {...register('age', { valueAsNumber: true })}
          required
        />
      </Field>
      <Field id="gender" label="Gender" error={errors.gender?.message}>
        <select id="gender" {...register('gender')} required>
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
      <Field id="email" label="Email" error={errors.email?.message}>
        <input id="email" type="email" {...register('email')} required />
      </Field>
      <Field id="password" label="Password" error={errors.password?.message}>
        <input id="password" type="password" {...register('password')} />
        <PasswordIndicator password={password} />
      </Field>
      <Field
        id="confirmPassword"
        label="Confirm Password"
        error={errors.confirmPassword?.message}
      >
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
        />
      </Field>
      <ImageUpload
        name="image"
        error={errors.image?.message}
        onChange={(file) => {
          if (file) {
            setValue('image', file, { shouldValidate: true });
          }
        }}
      />
      <Field id="country" label="Country" error={errors.country?.message}>
        <CountryAutocomplete
          name="country"
          error={errors.country?.message}
          onChange={handleCountryChange}
        />
      </Field>
      <div className={cx('checkbox-field', { error: !!errors.terms })}>
        <input id="terms" type="checkbox" {...register('terms')} />
        <label htmlFor="terms">Accept Terms & Conditions</label>
        <span className={cx('error-message')}>
          {errors.terms?.message ?? ''}
        </span>
      </div>
    </div>
  );
}
