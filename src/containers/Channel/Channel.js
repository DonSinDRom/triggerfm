import React, { Component, PropTypes } from 'react';
import { Aside } from 'containers';
import styles from './Channel.scss';

export default class Channel extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className={styles.channel}>
        <Aside />
        <div className={styles.channel__content}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
