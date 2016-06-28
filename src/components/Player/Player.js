import React, { Component, PropTypes } from 'react';
import Draggable from 'react-draggable';
import { findDOMNode } from 'react-dom';

export default class Player extends Component {
  static propTypes = {
    streams: PropTypes.array.isRequired
  };

  state = {
    isPlaying: false,
    volume: 30,
    supportedFormats: [],
    sliderRect: {}
  };

  componentDidMount() {
    const slider = findDOMNode(this.refs.slider);
    setTimeout(() => {
      const _rect = slider.getBoundingClientRect();
      if (_rect.top > 0 && _rect.width > 0) {
        const rect = {
          bottom: Math.round(_rect.bottom),
          height: Math.round(_rect.height),
          left: Math.round(_rect.left),
          right: Math.round(_rect.right),
          top: Math.round(_rect.top),
          width: Math.round(_rect.width)
        };
        this.setState({
          sliderRect: rect
        });
      }
    }, 10);
    const { volume } = this.state;
    const audio = findDOMNode(this.refs.audio);
    audio.volume = volume / 100;
    this.detectSupportedFormats();
  }

  detectSupportedFormats() {
    const { streams } = this.props;
    const tempAudio = document.createElement('audio');
    const supportedFormats = streams.map((el) => {
      if (!!(tempAudio.canPlayType && tempAudio.canPlayType(el.canPlayType).replace(/no/, ''))) {
        return {
          src: el.src,
          type: el.type,
          format: el.format
        };
      }
    });
    this.setState({
      supportedFormats: supportedFormats
    });
  }

  togglePlay() {
    const { isPlaying } = this.state;
    const audio = findDOMNode(this.refs.audio);
    if (isPlaying) {
      const _p = audio.pause();
      if (_p && (typeof Promise !== 'undefined') && (_p instanceof Promise)) {
        _p.catch((err) => {
          console.log(`Caught pending play exception - continuing (${err})`);
        });
      }
    } else {
      const _p = audio.play();
      if (_p && (typeof Promise !== 'undefined') && (_p instanceof Promise)) {
        _p.catch((err) => {
          console.log(`Caught pending play exception - continuing (${err})`);
        });
      }
    }
    this.setState({
      isPlaying: !isPlaying
    });
  }

  handleVolume(ev) {
    this._setVolume(ev.clientX);
  }

  handleDrag(ev) {
    this._setVolume(ev.clientX);
  }

  _setVolume(clientX) {
    const { sliderRect, volume } = this.state;
    let _volume = volume;
    if (clientX > sliderRect.right) {
      _volume = 100;
    } else if (clientX < sliderRect.left) {
      _volume = 0;
    } else {
      _volume = Math.round(((clientX - sliderRect.left) / sliderRect.width) * 100);
    }
    this.setState({
      volume: _volume
    });
    const audio = findDOMNode(this.refs.audio);
    audio.volume = _volume / 100;
  }

  render() {
    const styles = require('./Player.scss');
    const onImage = require('./images/on.svg');
    const offImage = require('./images/off.svg');

    const { isPlaying, volume, sliderRect, supportedFormats } = this.state;

    const sources = supportedFormats.map(el => <source key={el.format} src={el.src} type={el.type} />);
    const volumePosition = Math.round(sliderRect.width / 100 * volume) || 0;
    const _isPlaying = isPlaying ? onImage : offImage;

    return (
      <div className={styles.player}>
        <div className={styles.player__control}>
          <audio ref="audio">{sources}</audio>
          <img className={styles.player__control_img} src={_isPlaying} onClick={() => { this.togglePlay(); }} />
          <div className={styles.player__volume} ref="slider" onClick={(ev) => { this.handleVolume(ev); }}>
            <Draggable
              bounds="parent"
              axis="x"
              handle={'.' + styles.player__volume_drag}
              position={{x: volumePosition, y: 0}}
              onDrag={(ev) => { this.handleDrag(ev); }}>
              <div className={styles.player__volume_drag} />
            </Draggable>
            <div className={styles.player__volume_fill} style={{ width: volumePosition }} />
          </div>
        </div>
      </div>
    );
  }
}
