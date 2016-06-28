import React, { Component, PropTypes } from 'react';
import { Player } from 'components';
import { Link } from 'react-router';
import { connect } from 'react-redux';

/**
 * Convert seconds to hh-mm-ss format.
 * @param {number} totalSeconds - the total seconds to convert to hh- mm-ss
**/
const secondsTohhmmss = (totalSeconds) => {
  const _n = Number(totalSeconds);
  const _h = Math.floor(_n / 3600);
  const _m = Math.floor(_n % 3600 / 60);
  const _s = Math.floor(_n % 3600 % 60);
  const hours = _h < 10 ? `0${_h}` : _h;
  const minutes = _m < 10 ? `0${_m}` : _m;
  const seconds = _s < 10 ? `0${_s}` : _s;
  return hours + ':' + minutes + ':' + seconds;
};

@connect(
  state => ({
    user: state.app.user,
    listenersActive: state.app.channel.a,
    listenersTotal: state.app.channel.lst
  }))
export default class Aside extends Component {
  static propTypes = {
    user: PropTypes.object,
    listenersActive: PropTypes.number,
    listenersTotal: PropTypes.number
  }

  render() {
    const styles = require('./Aside.scss');
    const logoImage = require('./images/logo.svg');
    const streams = [
      {
        src: 'http://main.trigger.fm/stream/main',
        format: 'ogg',
        type: 'application/ogg',
        canPlayType: 'audio/ogg; codecs="vorbis"' // from http://diveintohtml5.info/everything.html
      },
      {
        src: 'http://main.trigger.fm/stream/mainmp3',
        format: 'mp3',
        type: 'audio/mpeg',
        canPlayType: 'audio/mpeg;'
      }
    ];
    const { user, listenersActive, listenersTotal } = this.props;
    const canUpload = user.t;

    return (
      <aside className={styles.aside}>
        <Player streams={streams} />
        <Link className={styles.aside__logo} to="http://trigger.fm/">
          <img className={styles.aside__logo_img} src={logoImage} />
        </Link>
        <ul className={styles.aside__stats}>
          <li className={styles.aside__stat}>
            Total listeners: <var className={styles.aside__stat_value}>{listenersTotal}</var>
          </li>
          <li className={styles.aside__stat}>
            active: <var className={styles.aside__stat_value}>{listenersActive}</var>
          </li>
        </ul>
        <span>You can upload: {secondsTohhmmss(canUpload)}</span>
        <button className={styles.aside__upload}>+</button>
      </aside>
    );
  }
}
