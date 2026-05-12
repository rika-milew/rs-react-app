import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './header.module.css';

const cx = classNames.bind(styles);

const SCROLL = 5;

export function Header() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sticky = window.scrollY > SCROLL;

      setIsSticky((previous) => {
        if (previous === sticky) {
          return previous;
        }

        return sticky;
      });
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cx('header', {
        sticky: isSticky,
      })}
    >
      <h1 className={cx('logo')}>
        RS <span>React App</span>
      </h1>
      <p className={cx('text')}>React Class Components</p>
    </header>
  );
}
