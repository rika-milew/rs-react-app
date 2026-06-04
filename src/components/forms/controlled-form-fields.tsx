import type { UseFormRegister } from 'react-hook-form';
import type { FormValues } from '@/types/form-types';

type ControlledFormFieldsProps = {
  register: UseFormRegister<FormValues>;
};

export function ControlledFormFields({ register }: ControlledFormFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" {...register('name')} required />
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          {...register('age', { valueAsNumber: true })}
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} required />
      </div>

      <div>
        <label htmlFor="gender">Gender</label>
        <select id="gender" {...register('gender')} required>
          <option value="" disabled>
            Select gender
          </option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </div>

      <div>
        <input id="terms" type="checkbox" {...register('terms')} />
        <label htmlFor="terms">Accept Terms & Conditions</label>
      </div>
    </>
  );
}
