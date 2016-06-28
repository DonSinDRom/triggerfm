import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import classNames from 'classnames/bind';
import styles from './Track.scss';

const cx = classNames.bind(styles);

export default class TrackHistory extends Component {
  static propTypes = {
    data: PropTypes.object,
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

  render() {
    const coverImage = require('./images/nocover.png');

    const { t, a, r, tg, tt, g, s, sid, n, p } = this.props.data; // eslint-disable-line no-shadow
    const votes = n.length + p.length;
    const tags = tg.length > 0 ? (<div className={styles.track__row}>
          <span className={styles.track__tags}>
            {tg.map((tagItem) => <span key={tagItem.id} className={styles.track__tag}>{tagItem.n}</span>)}
          </span>
        </div>) : null;

    return (
      <li className={styles.track}>
        <div className={styles.track__row}>
          <span className={cx({
            [styles.track__cover]: true,
            [styles.track__cover____gold]: g
          })}>
            <img className={styles.track__cover_img} src={coverImage} />
          </span>
          <hgroup className={styles.track__header}>
            <h3 className={styles.track__artist}>{a}</h3>
            <h4 className={styles.track__title}>{t}</h4>
          </hgroup>
          <time className={styles.track__time}>{moment(tt).calendar()}</time>
          <span className={cx({
            [styles.track__votes]: true,
            [styles.track__votes____minus]: this.state.votedMinus,
            [styles.track__votes____plus]: this.state.votedPlus
          })}>
            <var className={styles.track__votes_rating}>{r}</var>
            <span className={styles.track__votes_divider}>/</span>
            <var className={styles.track__votes_count}>{votes}</var>
          </span>
        </div>
        {tags}
        <div className={styles.track__row}>
          <span className={styles.track__uploader}>прнс <a className={styles.track__uploader_link} href={sid}>{s}</a></span>
        </div>
      </li>
    );
  }
}
