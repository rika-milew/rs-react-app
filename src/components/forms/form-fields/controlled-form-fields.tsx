import classNames from 'classnames/bind';
import type { UseFormRegister } from 'react-hook-form';
import { GENDER_OPTIONS } from '@/constants/constants';
import type { FormValues } from '@/types/form-types';

import styles from './form-fields.module.css';

const cx = classNames.bind(styles);

type ControlledFormFieldsProps = {
  register: UseFormRegister<FormValues>;
};

export function ControlledFormFields({ register }: ControlledFormFieldsProps) {
  return (
    <div className={cx('form-fields')}>
      <div className={cx('field')}>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" {...register('name')} required />
      </div>

      <div className={cx('field')}>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          {...register('age', { valueAsNumber: true })}
          required
        />
      </div>
      <div className={cx('field')}>
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
        </select>
      </div>
      <div className={cx('field')}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} required />
      </div>
      <div className={cx('checkbox-field')}>
        <input id="terms" type="checkbox" {...register('terms')} />
        <label htmlFor="terms">Accept Terms & Conditions</label>
      </div>
    </div>
  );
}
