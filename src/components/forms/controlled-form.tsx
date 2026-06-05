import classNames from 'classnames/bind';
import { Button } from '@/components/button/button';
import { useForm } from 'react-hook-form';
import { useFormDataStore } from '@/store/use-form-data-store';
import type { FormValues } from '@/types/form-types';
import { ControlledFormFields } from './form-fields/controlled-form-fields';
import { DEFAULT_FORM_VALUES } from '@/constants/constants';
import styles from './form.module.css';

const cx = classNames.bind(styles);

type ControlledFormProps = {
  onSuccess: () => void;
};

export function ControlledForm({ onSuccess }: ControlledFormProps) {
  const saveSubmission = useFormDataStore((state) => state.saveSubmission);

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const onSubmit = (data: FormValues) => {
    saveSubmission({
      ...data,
    });
    reset();
    onSuccess();
  };

  return (
    <form
      className={cx('form')}
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit(onSubmit)(event);
      }}
    >
      <ControlledFormFields register={register} />
      <Button text="Submit" type="submit" />
    </form>
  );
}
