import classNames from 'classnames/bind';
import { useState } from 'react';
import { Button } from '@/components/button/button';
import { Modal } from '@/components/modal/modal';
import { UncontrolledForm } from '@/components/forms/uncontrolled-form';
import { ControlledForm } from '@/components/forms/controlled-form';
import styles from './home-page.module.css';

const cx = classNames.bind(styles);

type FormType = 'uncontrolled' | 'controlled';

export const HomePage = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [formType, selectFormType] = useState<FormType | null>(null);

  return (
    <div className={cx('home-page')}>
      <h1>React Forms</h1>
      <Button
        text="Open Uncontrolled Form"
        onClick={() => {
          selectFormType('uncontrolled');
          setModalVisible(true);
        }}
        variant="primary"
      />

      <Button
        text="Open Controlled Form"
        onClick={() => {
          selectFormType('controlled');
          setModalVisible(true);
        }}
        variant="secondary"
      />
      <Modal isVisible={isModalVisible} onClose={() => setModalVisible(false)}>
        {formType === 'uncontrolled' && (
          <UncontrolledForm onSubmit={(data) => console.log(data)} />
        )}

        {formType === 'controlled' && <ControlledForm />}
      </Modal>
    </div>
  );
};
