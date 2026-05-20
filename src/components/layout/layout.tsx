import classNames from 'classnames/bind';
import { Header } from '@/components/layout/header/header';
import { Footer } from '@/components/layout/footer/footer';
import { Flyout } from '@/components/flyout/flyout';
import styles from './layout.module.css';

const cx = classNames.bind(styles);

type Props = {
  children: React.ReactNode;
};

export function Layout({ children }: Props) {
  return (
    <div className={cx('wrapper')}>
      <Header />
      <main id="main-content" className={cx('main')}>
        <div className={cx('container')}>{children}</div>
      </main>
      <Flyout />
      <Footer />
    </div>
  );
}
