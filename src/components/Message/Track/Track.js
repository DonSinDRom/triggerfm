import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from './Track.scss';

const cx = classNames.bind(styles);

export default class MessageTrack extends Component {
  static propTypes = {
    id: PropTypes.object
  }

  render() {
    return (
      <li className={cx({
        [styles.track]: true
      })}>id: {this.props.id}
      </li>
    );
  }
}
