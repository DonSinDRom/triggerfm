import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import createMiddleware from './middleware/clientMiddleware';
import { routerMiddleware } from 'react-router-redux';
import createSocketIoMiddleware from 'redux-socket.io';
import thunk from 'redux-thunk';
import io from 'socket.io-client';
// import md5 from 'md5';
import { WELCOME, NEWCURRENT, CHANNELDATA, LOGINSTATUS, UPTR, ADDTRACK, LST, MESSAGE, USUPD, USER__PUSH, USER__DELETE } from './constants';

const socket = io('http://trigger.fm');
const socketIoMiddleware = createSocketIoMiddleware(socket, 'ws/');
global.socket = socket;

export default function createStore(history, client, data) {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history);

  const middleware = [createMiddleware(client), socketIoMiddleware, reduxRouterMiddleware, thunk];

  socket.on('getver', () => {
    socket.emit('ver', {
      v: 2205,
      init: true
    });
//    socket.emit('login', {
//      u: '0',
//      p: md5('azaza123')
//    });
  });

  let finalCreateStore;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../containers/DevTools/DevTools');
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  const reducer = require('./modules/reducer');
  const store = finalCreateStore(reducer, data);

  socket.on(WELCOME.legacy, (_data) => {
    store.dispatch({ type: WELCOME.api, data: _data });
  });
  socket.on(NEWCURRENT.legacy, (_data) => {
    store.dispatch({ type: NEWCURRENT.api, data: _data });
  });
  socket.on(CHANNELDATA.legacy, (_data) => {
    store.dispatch({ type: CHANNELDATA.api, data: _data });
  });
  socket.on(LOGINSTATUS.legacy, (_data) => {
    store.dispatch({ type: LOGINSTATUS.api, data: _data });
  });
  socket.on(UPTR.legacy, (_data) => {
    store.dispatch({ type: UPTR.api, data: _data });
  });
  socket.on(ADDTRACK.legacy, (_data) => {
    store.dispatch({ type: ADDTRACK.api, data: _data });
  });
  socket.on(LST.legacy, (_data) => {
    store.dispatch({ type: LST.api, data: _data });
  });
  socket.on(MESSAGE.legacy, (_data) => {
    store.dispatch({ type: MESSAGE.api, data: _data });
  });
  socket.on(USUPD.legacy, (_data) => {
    store.dispatch({ type: USUPD.api, data: _data });
  });
  socket.on(USER__PUSH.legacy, (_data) => {
    store.dispatch({ type: USER__PUSH.api, data: _data });
  });
  socket.on(USER__DELETE.legacy, (_data) => {
    store.dispatch({ type: USER__DELETE.api, data: _data });
  });

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
