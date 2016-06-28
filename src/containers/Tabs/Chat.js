import React, { Component, PropTypes } from 'react';
import { Message, User } from 'components';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { sendmessage, getchat } from 'redux/modules/app';
import classNames from 'classnames/bind';
import styles from './Chat.scss';

const cx = classNames.bind(styles);

@connect(
  state => ({
    messages: state.app.messages,
    users: state.app.users
  }),
  { sendmessage, getchat })
export default class Chat extends Component {
  static propTypes = {
    messages: PropTypes.array,
    users: PropTypes.array,
    sendmessage: PropTypes.func.isRequired,
    getchat: PropTypes.func.isRequired
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.getchat();
    }, 1000);
  }

  handleEnter(ev) {
    if (ev.charCode === 13) {
      const message = findDOMNode(this.refs.message);
      this.props.sendmessage(message.value);
      message.value = '';
    }
  }

  render() {
    return (
      <div className={styles.chat}>
        <header className={styles.chat__header}>
          <ul className={styles.chat__messageList}>
            {this.props.messages.map((message) => {
              return <Message key={message.t} data={message} />;
            })}
          </ul>
          <ul className={styles.chat__userList}>
            {this.props.users.map((user) => {
              return <User key={user.id} data={user} />;
            })}
          </ul>
        </header>
        <footer className={styles.chat__input}>
          <textarea className={styles.chat__input_textarea} onKeyPress={(ev) => this.handleEnter(ev) } ref="message" type="text" placeholder="start typing here..." />
          <footer className={styles.chat__input_footer}>
            <button className={cx({
              [styles.chat__input_button]: true,
              [styles.chat__input_button____bold]: true
            })}>bold</button>
            <button className={cx({
              [styles.chat__input_button]: true,
              [styles.chat__input_button____irony]: true
            })}>irony</button>
            <label className={styles.chat__input_label}>
              <span className={styles.chat__input_labeltext}>Tink</span>
              <input className={styles.chat__input_labelinput} type="checkbox" />
            </label>
            <label className={styles.chat__input_label}>
              <span className={styles.chat__input_labeltext}>Images</span>
              <input className={styles.chat__input_labelinput} type="checkbox" />
            </label>
          </footer>
        </footer>
      </div>
    );
  }
}
