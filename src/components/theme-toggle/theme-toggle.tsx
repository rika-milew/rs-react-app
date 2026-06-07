import classNames from 'classnames/bind';
import { useTheme } from '@/theme-context/theme-context';
import styles from './theme-toggle.module.css';

const cx = classNames.bind(styles);

import { SunIcon, MoonIcon } from '@/assets/icons';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDefault = theme === 'dark';

  return (
    <button
      type="button"
      className={cx('theme-toggle')}
      onClick={toggleTheme}
      aria-label={`Switch to the ${isDefault ? 'light' : 'dark'} mode`}
      title={`Switch to the ${isDefault ? 'light' : 'dark'} mode`}
      data-theme={theme}
    >
      <div className={cx('icon-container')}>
        <SunIcon className={cx('icon', { visible: isDefault })} />
        <MoonIcon className={cx('icon', { visible: !isDefault })} />
      </div>
    </button>
  );
};
