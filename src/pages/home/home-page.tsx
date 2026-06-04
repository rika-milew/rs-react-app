import classNames from 'classnames/bind';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/button/button';
import { Modal } from '@/components/modal/modal';
import { Card } from '@/components/card/card';
import { UncontrolledForm } from '@/components/forms/uncontrolled-form';
import { ControlledForm } from '@/components/forms/controlled-form';
import { useFormDataStore } from '@/store/use-form-data-store';
import styles from './home-page.module.css';
import { ANIMATION_DURATION } from '@/constants/constants';

const cx = classNames.bind(styles);

type FormType = 'uncontrolled' | 'controlled';

export const HomePage = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [formType, selectFormType] = useState<FormType | null>(null);
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

  const handleSuccess = () => {
    setModalVisible(false);
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
      <Button
        text="Open Uncontrolled Form"
        onClick={() => {
          selectFormType('uncontrolled');
          setModalVisible(true);
        }}
        variant="secondary"
      />

      <Button
        text="Open Controlled Form"
        onClick={() => {
          selectFormType('controlled');
          setModalVisible(true);
        }}
        variant="primary"
      />
      <Modal isVisible={isModalVisible} onClose={() => setModalVisible(false)}>
        {formType === 'uncontrolled' && (
          <UncontrolledForm onSuccess={handleSuccess} />
        )}

        {formType === 'controlled' && (
          <ControlledForm onSuccess={handleSuccess} />
        )}
      </Modal>
      <section className={cx('cards-section')}>
        <div className={cx('section-header')}>
          <h2>Submissions History</h2>
          <span className={cx('badge')}>
            {cards.length} {cards.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        {cards.length === 0 ? (
          <div className={cx('empty-state')}>
            <h3>No submissions yet</h3>
            <p>Fill in the form to get started</p>
          </div>
        ) : (
          <div className={cx('cards-grid')}>
            {cards.map((card) => (
              <Card
                key={card.id}
                data={card}
                isRecent={card.id === recentCard}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
