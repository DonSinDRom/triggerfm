import React, { Component } from 'react';
import styles from './Loader.scss';

export default class Loader extends Component {

  render() {
    return (
      <span className={styles.loader}>
        <span className={styles.loader__inner} />
      </span>
    );
  }
}
