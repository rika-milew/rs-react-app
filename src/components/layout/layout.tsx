import classNames from 'classnames/bind';
import type { ReactNode } from 'react';
import { Header } from '@/components//layout/header/header';
import { Footer } from '@/components/layout/footer/footer';
import styles from './layout.module.css';

const cx = classNames.bind(styles);

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className={cx('wrapper')}>
      <Header />
      <main id="main-content" className={cx('main')}>
        <div className={cx('container')}>{children}</div>
      </main>
      <Footer />
    </div>
  );
}
