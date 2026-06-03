import classNames from 'classnames/bind';
import { useState } from 'react';
import { Button } from '@/components/button/button';
import { Modal } from '@/components/modal/modal';
import styles from './home-page.module.css';

const cx = classNames.bind(styles);

export const HomePage = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <div className={cx('home-page')}>
      <h1>React Forms</h1>
      <Button
        text="Open Modal"
        onClick={() => setModalVisible(true)}
        variant="primary"
      ></Button>
      <Modal isVisible={isModalVisible} onClose={() => setModalVisible(false)}>
        <form>
          <input placeholder="Name" />
          <Button text="Submit" type="submit" />
        </form>
      </Modal>
    </div>
  );
};
