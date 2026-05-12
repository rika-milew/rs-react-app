import styles from './layout.module.css';
import { Header } from '@/components/layout/header/header';
import { Footer } from '@/components/layout/footer/footer';

import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

type Props = {
  children: React.ReactNode;
};

export function Layout({ children }: Props) {
  return (
    <div className={cx('wrapper')}>
      <Header />
      <main className={cx('main')}>
        <div className={cx('container')}>{children}</div>
      </main>
      <Footer />
    </div>
  );
}
