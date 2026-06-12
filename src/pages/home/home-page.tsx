import classNames from 'classnames/bind';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/button/button';
import { Modal } from '@/components/modal/modal';
import { UncontrolledForm } from '@/components/forms/uncontrolled-form/uncontrolled-form';
import { ControlledForm } from '@/components/forms/controlled-form/controlled-form';
import { useFormDataStore } from '@/store/use-form-data-store';
import { useModalStore } from '@/store/use-modal-store';
import { CardsSection } from '@/components/cards-section/cards-section';
import { ANIMATION_DURATION } from '@/constants/constants';
import styles from './home-page.module.css';

const cx = classNames.bind(styles);

export const HomePage = () => {
  const { isModalVisible, formType, openModal, closeModal } = useModalStore();
  const [recentCard, setRecentCard] = useState<string | null>(null);
  const cards = useFormDataStore((state) => state.submissions);
  const previousCardsLength = useRef(cards.length);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const markRecentCard = (id: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setRecentCard(id);

    timerRef.current = setTimeout(() => {
      setRecentCard(null);
      timerRef.current = null;
    }, ANIMATION_DURATION);
  };

  useEffect(() => {
    if (cards.length > previousCardsLength.current) {
      markRecentCard(cards[0].id);
    }
    previousCardsLength.current = cards.length;
  }, [cards]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className={cx('home-page')}>
      <h1 className={cx('title')}>React Forms</h1>
      <div className={cx('button-container')}>
        <Button
          text="Open Uncontrolled Form"
          onClick={() => openModal('uncontrolled')}
          variant="secondary"
        />
        <Button
          text="Open Controlled Form"
          onClick={() => openModal('controlled')}
          variant="primary"
        />
      </div>
      <Modal isVisible={isModalVisible} onClose={closeModal}>
        {formType === 'uncontrolled' && (
          <UncontrolledForm onSuccess={closeModal} />
        )}
        {formType === 'controlled' && <ControlledForm onSuccess={closeModal} />}
      </Modal>
      <CardsSection recentCardId={recentCard} />
    </div>
  );
};
