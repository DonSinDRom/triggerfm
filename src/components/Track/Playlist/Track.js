import React, { Component, PropTypes } from 'react';
import { trackvote } from 'redux/modules/app';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './Track.scss';

const cx = classNames.bind(styles);

const MdExpandLess = require('react-icons/lib/md/expand-less');
const MdExpandMore = require('react-icons/lib/md/expand-more');

/**
 * Convert seconds to hh-mm-ss format.
 * @param {number} totalSeconds - the total seconds to convert to hh- mm-ss
**/
const secondsTohhmmss = (totalSeconds) => {
  const _n = Number(totalSeconds);
  const _h = Math.floor(_n / 3600);
  const _m = Math.floor(_n % 3600 / 60);
  const _s = Math.floor(_n % 3600 % 60);
  let hours = '';
  if (_h > 0) {
    if (_h < 10) {
      hours = `0${_h}`;
    }
    hours += ':';
  }
  let minutes = '';
  if (_m > 0) {
    if (_m < 10) {
      minutes = `0${_m}`;
    }
    minutes += ':';
  }
  let seconds = _s;
  if (_s > 0) {
    if (_s < 10) {
      seconds = `0${_s}`;
    }
  }
  return hours + minutes + seconds;
};

@connect(
  state => ({
    userId: state.app.user.id
  }),
  { trackvote })
export default class Track extends Component {
  static propTypes = {
    data: PropTypes.object,
    trackvote: PropTypes.func,
    userId: PropTypes.number
  }

  state = {
    votedMinus: false,
    votedPlus: false
  };

  componentWillReceiveProps(newProps) {
    if (newProps.data) {
      const isVotedMinus = newProps.data.n.some(el => el.vid === newProps.userId);
      const isVotedPlus = newProps.data.p.some(el => el.vid === newProps.userId);
      this.setState({
        votedMinus: isVotedMinus,
        votedPlus: isVotedPlus
      });
    }
  }

  vote(value) {
    const id = this.props.data.id;
    if (socket) {
      const vote = (value < 0 && this.state.votedMinus || value > 0 && this.state.votedPlus) ? 0 : value;
      this.props.trackvote(id, vote);
    }
  }

  render() {
    const coverImage = require('./images/nocover.png');

    const { t, a, r, tt, tg } = this.props.data; // eslint-disable-line no-shadow
    return (
      <li className={styles.track}>
        <span className={styles.track__cover}>
          <img className={styles.track__cover_img} src={coverImage} />
        </span>
        <hgroup className={styles.track__header}>
          <h3 className={styles.track__artist}>{a}</h3>
          <h4 className={styles.track__title}>{t}</h4>
        </hgroup>
        <span className={styles.track__tags}>
          {tg.map((tagItem) => <span key={tagItem.id} className={styles.track__tag}>{tagItem.n}</span>)}
        </span>
        <span className={styles.track__times}>
          <time className={styles.track__time}>{secondsTohhmmss(tt)}</time>
        </span>
        <span className={cx({
          [styles.track__votes]: true,
          [styles.track__votes____minus]: this.state.votedMinus,
          [styles.track__votes____plus]: this.state.votedPlus
        })}>
          <button className={cx({
            [styles.track__vote]: true,
            [styles.track__vote____minus]: true
          })} onClick={() => this.vote(-1) }>
            <MdExpandMore />
          </button>
          <var className={styles.track__votes_rating}>{r}</var>
          <button className={cx({
            [styles.track__vote]: true,
            [styles.track__vote____plus]: true
          })} onClick={() => this.vote(1) }>
            <MdExpandLess />
          </button>
        </span>
      </li>
    );
  }
}
