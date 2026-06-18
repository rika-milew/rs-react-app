import classNames from 'classnames/bind';
import styles from '../styles/pages/about-page.module.css';

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
          rel="noopener noreferrer"
        >
          rika-milew
          <span className={cx('visually-hidden')}> (Opens in new tab)</span>
        </a>
      </p>

      <p className={cx('text')}>
        This is a React application built during{' '}
        <a
          className={cx('link')}
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          RS School React Course
          <span className={cx('visually-hidden')}> (Opens in new tab)</span>
        </a>{' '}
        demonstrating routing, pagination, and master-detail architecture using
        TanStack Router.
      </p>
    </div>
  );
};
