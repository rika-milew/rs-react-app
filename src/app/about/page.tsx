import classNames from 'classnames/bind';
import styles from '@/styles/pages/about-page.module.css';

const cx = classNames.bind(styles);

const content = {
  en: {
    title: 'About',
    author: 'Author: Eryka Mileuskaya',
    startDescription: 'This is a React application built during',
    link: 'RS School React Course',
    endDescription:
      'demonstrating routing, pagination, and master-detail architecture using Next.js App Router.',
    newTab: ' (Opens in new tab)',
  },
  be: {
    title: 'Аб дадатку',
    author: 'Аўтар: Эрыка Мілеўская',
    startDescription: 'Гэта React-дадатак, створаны падчас',
    link: 'курса RS School па React',
    endDescription:
      ', які дэманструе маршрутызацыю, пагінацыю і архітэктуру з выкарыстаннем Next.js App Router.',
    newTab: ' (Адкрываецца ў новай укладцы)',
  },
};

const getContent = (locale: string) => {
  if (locale === 'be') {
    return content.be;
  }
  return content.en;
};

export default async function AboutPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const locale = params.lang === 'be' ? 'be' : 'en';

  const t = getContent(locale);

  return (
    <div className={cx('about')}>
      <h1>{t.title}</h1>

      <p className={cx('text')}>{t.author}</p>
      <p className={cx('text')}>
        Github:{' '}
        <a
          className={cx('link')}
          href="https://github.com/rika-milew"
          target="_blank"
          rel="noopener noreferrer"
        >
          rika-milew
          <span className={cx('visually-hidden')}>{t.newTab}</span>
        </a>
      </p>

      <p className={cx('text')}>
        {t.startDescription}{' '}
        <a
          className={cx('link')}
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.link}
          <span className={cx('visually-hidden')}>{t.newTab}</span>
        </a>{' '}
        {t.endDescription}
      </p>
    </div>
  );
}
