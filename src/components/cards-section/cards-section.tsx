import classNames from 'classnames/bind';
import { Card } from '@/components/card/card';
import { useFormDataStore } from '@/store/use-form-data-store';
import styles from './cards-section.module.css';

const cx = classNames.bind(styles);

type CardsSectionProps = {
  recentCardId: string | null;
};

export function CardsSection({ recentCardId }: CardsSectionProps) {
  const cards = useFormDataStore((state) => state.submissions);

  return (
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
              isRecent={card.id === recentCardId}
            />
          ))}
        </div>
      )}
    </section>
  );
}
