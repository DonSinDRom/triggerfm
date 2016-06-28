import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import moment from 'moment';
import styles from './Message.scss';
import MessageTrack from './Track/Track';

const cx = classNames.bind(styles);

@connect(
  state => ({
    user: state.app.user
  }))
export default class Message extends Component {
  static propTypes = {
    data: PropTypes.object,
    user: PropTypes.object
  }

  render() {
    const avatarImage = require('./images/avatar.jpg');
    const { m, t, uid, uname, pm } = this.props.data; // eslint-disable-line no-shadow
    const { id } = this.props.user;

    const regexp = /\/track\d+/gi;
    const _tracks = m.match(regexp);
    const tracks = !!_tracks ? _tracks.map(el => el.substring(6)) : [];
    const messageTracks = tracks.map(el => <MessageTrack key={el} id={el} />);

    return (
      <li className={cx({
        [styles.message]: true,
        [styles.message____private]: pm,
        [styles.message____own]: uid === id,
      })}>
        <span className={styles.message__avatar}>
          <img className={styles.message__avatar_img} src={avatarImage} />
        </span>
        <span className={styles.message__content}>
          <header className={styles.message__header}>
            <span className={styles.message__author}>{uname}</span>
            <time className={styles.message__time}>{moment(t).format('HH:mm')}</time>
          </header>
          <footer className={styles.message__footer}>
            <span className={styles.message__text}>{m.replace(/&gt;/ig, '>')}</span>
            <span className={styles.message__text}>{messageTracks}</span>
          </footer>
        </span>
      </li>
    );
  }
}
