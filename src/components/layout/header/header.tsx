import { useEffect, useState, useRef } from 'react';
import { Link } from '@tanstack/react-router';

import classNames from 'classnames/bind';
import styles from './header.module.css';

const cx = classNames.bind(styles);

const SCROLL = 5;

export function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) {
        return;
      }
      ticking.current = true;
      requestAnimationFrame(() => {
        const sticky = window.scrollY > SCROLL;
        setIsSticky((previous) => {
          if (previous === sticky) {
            return previous;
          }
          return sticky;
        });
        ticking.current = false;
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
      <a href="#main-content" className={cx('skip-link')}>
        Skip to the main content
      </a>
      <nav className={cx('nav')}>
        <Link
          to="/"
          className={cx('link')}
          activeProps={{ className: cx('active') }}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={cx('link')}
          activeProps={{ className: cx('active') }}
        >
          About
        </Link>
      </nav>
    </header>
  );
}
