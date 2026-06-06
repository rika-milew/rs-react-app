import classNames from 'classnames/bind';
import { Button } from '@/components/button/button';
import { useForm, useWatch } from 'react-hook-form';
import { useFormDataStore } from '@/store/use-form-data-store';
import type { FormValues } from '@/types/form-types';
import { ControlledFormFields } from './form-fields/controlled-form-fields';
import { DEFAULT_FORM_VALUES } from '@/constants/constants';
import { validationSchema } from '@/schemas/validation-schemas';
import { convertImage } from '@/utils/validate-image';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import type { SubmitEvent } from 'react';
import styles from './form.module.css';

const cx = classNames.bind(styles);

type ControlledFormProps = {
  onSuccess: () => void;
};

export function ControlledForm({ onSuccess }: ControlledFormProps) {
  const saveSubmission = useFormDataStore((state) => state.saveSubmission);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const password = useWatch({ control, name: 'password' });

  useEffect(() => {
    void trigger('confirmPassword');
  }, [password, trigger]);

  const imageFile = useWatch({
    control,
    name: 'image',
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const convertedImage = await convertImage(data.image);
      saveSubmission({
        ...data,
        image: convertedImage,
      });

      reset();
      onSuccess();
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  const handleFormSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
  };

  return (
    <form className={cx('form')} onSubmit={handleFormSubmit} noValidate>
      <ControlledFormFields
        register={register}
        errors={errors}
        setValue={setValue}
        imageFile={imageFile}
        watch={watch}
      />
      <Button text="Submit" type="submit" disabled={!isValid || isSubmitting} />
    </form>
  );
}
