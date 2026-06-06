import classNames from 'classnames/bind';
import { useRef, useState } from 'react';
import { UncontrolledFormFields } from './form-fields/uncontrolled-form-fields';
import { Button } from '@/components/button/button';
import type { SubmitEvent } from 'react';
import { useFormDataStore } from '@/store/use-form-data-store';
import { convertImage } from '@/utils/validate-image';
import { validationSchema } from '@/schemas/validation-schemas';
import { ValidationError } from 'yup';
import styles from './form.module.css';

const cx = classNames.bind(styles);

type UncontrolledFormProps = {
  onSuccess: () => void;
};

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function getNumber(formData: FormData, key: string): number | undefined {
  const value = formData.get(key);
  if (typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }
  const number_ = Number(value);
  return Number.isNaN(number_) ? undefined : number_;
}

export function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const saveSubmission = useFormDataStore((state) => state.saveSubmission);

  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const formValues = {
      name: getString(formData, 'name'),
      age: getNumber(formData, 'age'),
      email: getString(formData, 'email'),
      gender: getString(formData, 'gender'),
      terms: formData.get('terms') === 'on',
      password: getString(formData, 'password'),
      confirmPassword: getString(formData, 'confirmPassword'),
      country: getString(formData, 'country'),
      image: formData.get('image'),
    };

    validationSchema
      .validate(formValues, { abortEarly: false })
      .then((validData) => {
        setErrors({});

        if (!(validData.image instanceof File)) {
          return;
        }

        convertImage(validData.image)
          .then((convertedImage) => {
            saveSubmission({
              ...validData,
              image: convertedImage,
            });

            formRef.current?.reset();
            onSuccess();
          })
          .catch((error: unknown) => {
            console.error('Failed to convert image:', error);
          });
      })
      .catch((validationError: unknown) => {
        if (validationError instanceof ValidationError) {
          const fieldErrors: Record<string, string> = {};
          validationError.inner.forEach((error) => {
            if (error.path) {
              fieldErrors[error.path] = error.message;
            }
          });
          setErrors(fieldErrors);
        }
      });
  };
  return (
    <form
      className={cx('form')}
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
    >
      <UncontrolledFormFields errors={errors} />
      <Button text="Submit" type="submit" />
    </form>
  );
}
