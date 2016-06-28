import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import styles from './Tabs.scss';

export default class Tabs extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  state = {
    navRect: {},
    navItemRect: {},
    inc: {}
  }

  componentDidMount() {
    const nav = findDOMNode(this.refs.nav);
    setTimeout(() => {
      const _rect = nav.getBoundingClientRect();
      if (_rect.width > 0 && _rect.height > 0) {
        const rect = {
          bottom: Math.round(_rect.bottom),
          height: Math.round(_rect.height),
          left: Math.round(_rect.left),
          right: Math.round(_rect.right),
          top: Math.round(_rect.top),
          width: Math.round(_rect.width)
        };

        const nodes = nav.childNodes;
        console.log('this', this);
        const route = String(this.props.location.pathname);
        for (let node = 0, nodesCount = nodes.length; node < nodesCount; node ++) {
          const href = nodes[node].href;
          if (href && href.indexOf(route) > -1) {
            const tab = findDOMNode(nodes[node]);
            const tabRect = tab.getBoundingClientRect();
            this.setState({
              navItemRect: tabRect,
              inc: {
                left: tabRect.left,
                right: rect.width - tabRect.right
              }
            });
          }
        }
        this.setState({
          navRect: rect
        });
      }
    }, 10);
  }

  handleRoute(ev) {
    const { navRect, navItemRect } = this.state;
    const tab = findDOMNode(ev.target);
    const tabRect = tab.getBoundingClientRect();
    this.setState({
      navItemRect: tabRect,
      inc: {
        left: tabRect.left,
        right: navRect.width - tabRect.right,
        transition: tabRect.left > navItemRect.left ? `left .25s cubic-bezier(.35,0,.25,1),right .125s cubic-bezier(.35,0,.25,1)` : `left .125s cubic-bezier(.35,0,.25,1),right .25s cubic-bezier(.35,0,.25,1)`
      }
    });
  }

  render() {
    // console.log('navRect', this.state.navRect);
    return (
      <div className={styles.section}>
        <nav className={styles.section__tabs} ref="nav">
          <Link className={styles.section__tab} onClick={(ev) => this.handleRoute(ev) } to="/tabs/1" activeClassName={styles.section__tab____active}>1</Link>
          <Link className={styles.section__tab} onClick={(ev) => this.handleRoute(ev) } to="/tabs/2" activeClassName={styles.section__tab____active}>2</Link>
          <Link className={styles.section__tab} onClick={(ev) => this.handleRoute(ev) } to="/tabs/3" activeClassName={styles.section__tab____active}>3</Link>
          <Link className={styles.section__tab} onClick={(ev) => this.handleRoute(ev) } to="/tabs/4" activeClassName={styles.section__tab____active}>4</Link>
          <Link className={styles.section__tab} onClick={(ev) => this.handleRoute(ev) } to="/tabs/5" activeClassName={styles.section__tab____active}>5</Link>
          <Link className={styles.section__tab} onClick={(ev) => this.handleRoute(ev) } to="/tabs/6" activeClassName={styles.section__tab____active}>6</Link>
          <Link className={styles.section__tab} onClick={(ev) => this.handleRoute(ev) } to="/tabs/7" activeClassName={styles.section__tab____active}>7</Link>
          <Link className={styles.section__tab} onClick={(ev) => this.handleRoute(ev) } to="/tabs/8" activeClassName={styles.section__tab____active}>8</Link>
          <Link className={styles.section__tab} onClick={(ev) => this.handleRoute(ev) } to="/tabs/9" activeClassName={styles.section__tab____active}>9</Link>
          <span className={styles.section__inc} style={{ left: this.state.inc.left, right: this.state.inc.right, transition: this.state.inc.transition }} />
        </nav>
        <div className={styles.section__content}>
          <ReactCSSTransitionGroup
            className={styles.section__page}
            component="div"
            transitionAppear
            transitionEnterTimeout={750}
            transitionLeaveTimeout={750}
            transitionAppearTimeout={750}
            transitionName={{
              enter: styles.section__page____enter,
              enterActive: styles.section__page____enterActive,
              leave: styles.section__page____leave,
              leaveActive: styles.section__page____leaveActive,
              appear: styles.section__page____appear,
              appearActive: styles.section__page____appearActive
            }}>
            {React.cloneElement(this.props.children, {
              key: location.pathname
            })}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}
