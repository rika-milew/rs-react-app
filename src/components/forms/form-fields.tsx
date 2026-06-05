import classNames from 'classnames/bind';
import styles from './form.module.css';

const cx = classNames.bind(styles);

export function FormFields() {
  return (
    <div className={cx('form-fields')}>
      <div className={cx('field')}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" defaultValue="" required />
      </div>
      <div className={cx('field')}>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          name="age"
          type="number"
          defaultValue=""
          min={0}
          required
        />
      </div>
      <div className={cx('field')}>
        <label htmlFor="gender">Gender</label>
        <select id="gender" name="gender" defaultValue="" required>
          <option value="" disabled>
            Select gender
          </option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </div>
      <div className={cx('field')}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" defaultValue="" required />
      </div>
      <div className={cx('checkbox-field')}>
        <input id="terms" name="terms" type="checkbox" defaultChecked={false} />
        <label htmlFor="terms">Accept Terms & Conditions</label>
      </div>
    </div>
  );
}
