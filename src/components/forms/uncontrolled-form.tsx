import { FormFields } from './form-fields';
import { Button } from '@/components/button/button';
import type { SubmitEvent } from 'react';

type Props = {
  onSubmit: (data: Record<string, FormDataEntryValue>) => void;
};

export function UncontrolledForm({ onSubmit }: Props) {
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    onSubmit(data);
    event.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormFields mode="uncontrolled" />
      <Button text="Submit" type="submit" />
    </form>
  );
}
