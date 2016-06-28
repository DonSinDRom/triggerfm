import React, { Component, PropTypes } from 'react';
import { Player } from 'components';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import styles from './Start.scss';

@connect(
  state => ({
    track: state.app.track
  }))
export default class Start extends Component {
  static propTypes = {
    track: PropTypes.object
  }

  render() {
    const logoImage = require('./images/logo.svg');

    const { track } = this.props;
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

    return (
      <div className={styles.start}>
        <div className={styles.start__viewport}>
          <div className={styles.start__center}>
            <Link className={styles.start__logo} to="http://trigger.fm/">
              <img className={styles.start__logo_img} src={logoImage} />
            </Link>
            <Player streams={streams} />
            <header className={styles.start__header}>
              <hgroup className={styles.start__headers}>
                <h1 className={styles.start__artist}>
                  {track.a}
                </h1>
                <h2 className={styles.start__title}>
                  {track.t}
                </h2>
              </hgroup>
            </header>
          </div>
        </div>
        <section className={styles.start__section}>
          <div className={styles.start__section_content}>
            <p className={styles.start__section_text}>trigger.fm – первое онлайн-радио, программа которого составляется в реальном времени самими пользователями.</p>
          </div>
        </section>
        <section className={styles.start__section}>
          <div className={styles.start__section_content}>
            <p className={styles.start__section_text}>Здесь нет музыкальных редакторов, определяющих формат радиостанции.</p>
            <p className={styles.start__section_text}>У trigger.fm отсутствует какая-либо стилевая принадлежность – за долгие годы существования проекта он постоянно видоизменялся по воле своих главных руководителей - рядовых пользователей.</p>
          </div>
        </section>
        <section className={styles.start__section}>
          <div className={styles.start__section_content}>
            <p className={styles.start__section_text}>Каждый день множество людей совершенно разных музыкальных вкусов и предпочтений делятся с окружающими любимой музыкой в любых доступных форматах – ведь это так здорово.</p>
          </div>
        </section>
        <section className={styles.start__section}>
          <div className={styles.start__section_content}>
            <p className={styles.start__section_text}>Долой стеснение – пришла пора достать из потаённых архивов «те самые вещи», что заставляли твою жизнь расцветать новыми красками</p>
            <p className={styles.start__section_text}>Аудитория trigger.fm ждёт тебя, дорогой друг!</p>
          </div>
        </section>
        <footer className={styles.start__footer}>
          <Link className={styles.start__footer_link} to="/auth">Да! Я хочу к вам!</Link>
        </footer>
      </div>
    );
  }
}
