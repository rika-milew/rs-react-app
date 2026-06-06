import classNames from 'classnames/bind';
import { PASSWORD_RULES_CONFIG } from '@/constants/constants';
import styles from './password-indicator.module.css';

const cx = classNames.bind(styles);

type PasswordIndicatorProps = {
  password: string;
};

export function PasswordIndicator({ password }: PasswordIndicatorProps) {
  if (!password) {
    return null;
  }

  return (
    <div className={cx('password-indicator')}>
      {PASSWORD_RULES_CONFIG.map((rule) => {
        const isValid = rule.check(password);
        return (
          <div
            key={rule.key}
            className={cx('rule', { valid: isValid, invalid: !isValid })}
          >
            <span className={cx('icon')}>{isValid ? '✓' : '✗'}</span>
            <span className={cx('label')}>{rule.text}</span>
          </div>
        );
      })}
    </div>
  );
}
