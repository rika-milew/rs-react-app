import type { ChangeEvent } from 'react';

type FormFieldsProps = {
  values?: {
    name: string;
    age: string;
    email: string;
    gender: string;
    terms: boolean;
  };
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  mode: 'controlled' | 'uncontrolled';
};

export function FormFields({ values, onChange, mode }: FormFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={mode === 'controlled' ? values?.name : undefined}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          name="age"
          type="number"
          value={mode === 'controlled' ? values?.age : undefined}
          onChange={onChange}
          min={0}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={mode === 'controlled' ? values?.email : undefined}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          name="gender"
          value={mode === 'controlled' ? values?.gender : undefined}
          onChange={onChange}
          required
        >
          <option value="" disabled>
            Select gender
          </option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </div>
      <div>
        <input
          id="terms"
          name="terms"
          type="checkbox"
          checked={mode === 'controlled' ? values?.terms : undefined}
          onChange={onChange}
        />
        <label htmlFor="terms">Accept Terms & Conditions</label>
      </div>
    </>
  );
}
