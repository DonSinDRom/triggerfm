import React, { Component, PropTypes } from 'react';
import { auth } from 'redux/modules/app';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import { push } from 'react-router-redux';
import classNames from 'classnames/bind';
import styles from './Auth.scss';

const cx = classNames.bind(styles);

@connect(
  state => ({
    userStatus: state.app.userStatus
  }),
  { auth, pushState: push })
export default class Auth extends Component {
  static propTypes = {
    auth: PropTypes.func,
    userStatus: PropTypes.string,
    pushState: PropTypes.func.isRequired
  }

  state = {
    buttonDisabled: true,
    error: false
  };

  componentWillReceiveProps(newProps) {
    console.log('componentWillReceiveProps', newProps.userStatus);
    if (newProps.userStatus === 'success') {
      this.setState({
        error: false
      });
      this.props.pushState('/channel/main/chat');
    } else {
      this.setState({
        error: true
      });
    }
  }

  handleChange() {
    this.setState({
      error: false
    });
    const login = findDOMNode(this.refs.login).value;
    const password = findDOMNode(this.refs.password).value;
    if (login && password) {
      this.setState({
        buttonDisabled: false
      });
    }
  }

  handleClick(ev) {
    ev.preventDefault();
    const login = findDOMNode(this.refs.login).value;
    const password = findDOMNode(this.refs.password).value;
    this.props.auth(login, password);
    const { userStatus } = this.props;
    setTimeout(() => {
      if (userStatus === this.props.userStatus) {
        this.setState({
          error: true
        });
      }
    }, 400);
    console.log('handleClick', ev, login, password);
  }

  render() {
    return (
      <div className={styles.auth}>
        <ReactCSSTransitionGroup
          component="div"
          transitionAppear
          transitionEnterTimeout={750}
          transitionLeaveTimeout={750}
          transitionAppearTimeout={750}
          transitionName={{
            enter: styles.auth__form____enter,
            enterActive: styles.auth__form____enterActive,
            leave: styles.auth__form____leave,
            leaveActive: styles.auth__form____leaveActive,
            appear: styles.auth__form____appear,
            appearActive: styles.auth__form____appearActive
          }}>
          <form className={cx({
            [styles.auth__form]: true,
            [styles.auth__form____active]: this.state.error
          })}>
            <input className={styles.auth__input} ref="login" onChange={() => this.handleChange()} placeholder="Login" type="text" />
            <input className={styles.auth__input} ref="password" onChange={() => this.handleChange()} placeholder="Password" type="password" />
            <button className={styles.auth__button} onClick={(ev) => this.handleClick(ev)} disabled={this.state.buttonDisabled}>Login</button>
            <span className={styles.auth__status}>{this.props.userStatus}</span>
          </form>
        </ReactCSSTransitionGroup>
        <footer className={styles.auth__footer}>
          Trigger.fm
        </footer>
      </div>
    );
  }
}
