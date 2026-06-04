import { useState } from 'react';
import { FormFields } from './form-fields';
import { Button } from '@/components/button/button';
import type { SubmitEvent } from 'react';

export function ControlledForm() {
  const [values, setValues] = useState({
    name: '',
    age: '',
    email: '',
    gender: '',
    terms: false,
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = event.target;

    const name = target.name;

    const value: string | boolean =
      target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target.value;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  };
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormFields mode="controlled" values={values} onChange={handleChange} />
      <Button text="Submit" type="submit" />
    </form>
  );
}
