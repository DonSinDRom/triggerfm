import React, { Component, PropTypes } from 'react';
import { Track, TrackTop, UploadPls } from 'components';
import { connect } from 'react-redux';

@connect(
  state => ({
    playlist: state.app.playlist,
    track: state.app.track
  }))
export default class Playlist extends Component {
  static propTypes = {
    playlist: PropTypes.array,
    track: PropTypes.object
  }

  state = {
  };

  render() {
    const styles = require('./Playlist.scss');
    const { playlist } = this.props || [];
    const { track } = this.props || {};
    const uploadPls = playlist.length < 6 ? <UploadPls /> : '';

    return (
      <div className={styles.playlist}>
        <TrackTop data={track} />
        <ul className={styles.playlist_list}>
          {playlist.map((trackItem) => {
            return <Track key={trackItem.id} data={trackItem} />;
          })}
          {uploadPls}
        </ul>
      </div>
    );
  }
}
