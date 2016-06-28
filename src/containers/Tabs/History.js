import React, { Component, PropTypes } from 'react';
import { TrackHistory, Loader } from 'components';
import { connect } from 'react-redux';
import { gethistory } from 'redux/modules/app';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import { findDOMNode } from 'react-dom';

import styles from './History.scss';

@connect(
  state => ({
    channelId: state.app.channelId,
    history: state.app.history
  }),
  { gethistory })
export default class History extends Component {
  static propTypes = {
    gethistory: PropTypes.func,
    history: PropTypes.array,
    channelId: PropTypes.number
  }

  state = {
    isLoadingMore: false
  }

  componentDidMount() {
    const list = findDOMNode(this.refs.list);
    list.addEventListener('scroll', () => { this.handleScroll(); });
  }

  componentWillUnmount() {
    const list = findDOMNode(this.refs.list);
    list.removeEventListener('scroll', () => { this.handleScroll(); });
  }

  handleScroll() {
    const list = findDOMNode(this.refs.list);
    const scrollTop = list.scrollTop;
    const offsetHeight = list.offsetHeight;
    const scrollHeight = list.scrollHeight;
    if (offsetHeight + scrollTop >= scrollHeight) { // Check if user scrolled to bottom of the list
      this.showLoader();
      setTimeout(() => { this.hideLoader(); }, 2000);
      // this.loadData();
    }
  }

  showLoader() {
    this.setState({
      isLoadingMore: true
    });
  }

  hideLoader() {
    this.setState({
      isLoadingMore: false
    });
  }

  handleClick() {
    const isGold = this.refs.gold.checked;
    const isTop = this.refs.top.checked;
    const artist = this.refs.artist.value;
    const title = this.refs.title.value;
    const shift = 0;
    const votes = false;
    this.props.gethistory(this.props.channelId, shift, artist, title, isTop, isGold, votes);
  }

  loadData() {
    const isGold = this.refs.gold.checked;
    const isTop = this.refs.top.checked;
    const artist = this.refs.artist.value;
    const title = this.refs.title.value;
    const shift = new Date(Date.parse(this.props.history[0].tt) + 10800000 + 12000);
    const votes = false;
    this.props.gethistory(this.props.channelId, shift, artist, title, isTop, isGold, votes);
  }

  render() {
    const loader = this.state.isLoadingMore ? (<div className={styles.history__loader}><Loader /></div>) : null;
    return (
      <div className={styles.history}>
        <header className={styles.history__header}>
          <label className={styles.history__label}>
            <span className={styles.history__label_text}>Gold:</span>
            <input className={styles.history__label_value} ref="gold" type="checkbox" />
          </label>
          <label className={styles.history__label}>
            <span className={styles.history__label_text}>Top:</span>
            <input className={styles.history__label_value} ref="top" type="checkbox" />
          </label>
          <label className={styles.history__artist}>
            <input className={styles.history__artist_input} ref="artist" type="text" placeholder="artist" />
          </label>
          <label className={styles.history__title}>
            <input className={styles.history__title_input} ref="title" type="text" placeholder="title" />
          </label>
          <button className={styles.history__button} onClick={() => this.handleClick()}>Go!</button>
        </header>
        <ul className={styles.history_list} ref="list">
          {this.props.history.map((track) => {
            return <TrackHistory key={track.id} data={track} />;
          })}
          <ReactCSSTransitionGroup
            component="li"
            transitionAppear
            transitionEnterTimeout={750}
            transitionLeaveTimeout={750}
            transitionAppearTimeout={750}
            transitionName={{
              enter: styles.history__loader____enter,
              enterActive: styles.history__loader____enterActive,
              leave: styles.history__loader____leave,
              leaveActive: styles.history__loader____leaveActive,
              appear: styles.history__loader____appear,
              appearActive: styles.history__loader____appearActive
            }}>
            {loader}
          </ReactCSSTransitionGroup>
        </ul>
      </div>
    );
  }
}
