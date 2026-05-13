import styles from './about-page.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export const AboutPage = () => {
  return (
    <div className={cx('about')}>
      <h1>About</h1>

      <p className={cx('text')}>Author: Eryka Mileuskaya</p>
      <p className={cx('text')}>
        Github:{' '}
        <a
          className={cx('link')}
          href="https://github.com/rika-milew"
          target="_blank"
          rel="noreferrer"
        >
          rika-milew
        </a>
      </p>

      <p className={cx('text')}>
        This is a React application built during{' '}
        <a
          className={cx('link')}
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noreferrer"
        >
          RS School React Course
        </a>{' '}
        demonstrating routing, pagination, and master-detail architecture using
        TanStack Router.
      </p>
    </div>
  );
};
