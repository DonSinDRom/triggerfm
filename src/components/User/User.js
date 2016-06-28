import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from './User.scss';

const cx = classNames.bind(styles);

export default class User extends Component {
  static propTypes = {
    data: PropTypes.object
  }

  render() {
    const { n, a } = this.props.data; // eslint-disable-line no-shadow
    return (
      <li className={cx({
        [styles.user]: true,
        [styles.user____online]: a
      })}>
        <span className={styles.user__icon}>i</span>
        <span className={styles.user__name}>{n}</span>
      </li>
    );
  }
}
