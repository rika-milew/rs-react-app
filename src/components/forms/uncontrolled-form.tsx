import classNames from 'classnames/bind';
import { useRef } from 'react';
import { FormFields } from './form-fields/form-fields';
import { Button } from '@/components/button/button';
import type { SubmitEvent } from 'react';
import { useFormDataStore } from '@/store/use-form-data-store';
import styles from './form.module.css';

const cx = classNames.bind(styles);

type UncontrolledFormProps = {
  onSuccess: () => void;
};

export function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const saveSubmission = useFormDataStore((state) => state.saveSubmission);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get('name');
    const age = formData.get('age');
    const email = formData.get('email');
    const gender = formData.get('gender');
    const terms = formData.get('terms') === 'on';

    saveSubmission({
      name: typeof name === 'string' ? name : '',
      age: typeof age === 'string' ? Number(age) : 0,
      email: typeof email === 'string' ? email : '',
      gender: typeof gender === 'string' ? gender : '',
      terms,
    });

    formRef.current?.reset();
    onSuccess();
  };

  return (
    <form className={cx('form')} ref={formRef} onSubmit={handleSubmit}>
      <FormFields />
      <Button text="Submit" type="submit" />
    </form>
  );
}
