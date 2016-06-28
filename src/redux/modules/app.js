import md5 from 'md5';
import { WELCOME, NEWCURRENT, CHANNELDATA, LOGINSTATUS, UPTR, ADDTRACK, LST, MESSAGE, USUPD, USER__PUSH, USER__DELETE } from '../constants';

const AUTH = 'login';
const TRACKVOTE = 'trackvote';
const SENDMESSAGE = 'sendmessage';
const GETHISTORY = {
  legacy: 'gethistory',
  api: '/api/channel/history/get',
  callback: 'gethistoryCallback'
};
const GETCHAT = 'getchat';

const initialState = {
  channels: [],
  channel: {},
  channelId: 1,
  track: {},
  playlist: [],
  streamURL: {
    mp3: '',
    ogg: ''
  },
  history: [],
  messages: [],
  users: [],
  user: {},
  userStatus: null
};

const sortFunction = (_a, _b) => { const _n = _b.r - _a.r; return _n !== 0 ? _n : _a.id - _b.id; };

export function gethistoryCallback(data) {
  console.log('gethistoryCallback', data);
  return {
    type: GETHISTORY.callback,
    data: data
  };
}
export function gethistory(chid, shift, artist, title, isTop, isGold, votes) {
  return dispatch => {
    socket.emit('gethistory', {
      chid: chid,
      a: artist,
      g: isGold,
      s: shift,
      t: title,
      top: isTop,
      v: votes
    }, (data) => {
      console.log(GETHISTORY, this, data);
      dispatch(gethistoryCallback(data));
    });
  };
}

export function trackvote(id, vote) {
  return {
    type: TRACKVOTE,
    id: id,
    vote: vote
  };
}

export function sendmessage(message) {
  return {
    type: SENDMESSAGE,
    m: message
  };
}

export function getchatCallback(data) {
  console.log('getchatCallback', data);
  return {
    type: GETCHAT,
    data: data
  };
}
export function getchat() {
  console.log('getchat:initialState', initialState);
  const shift = initialState.messages && initialState.messages.length > 0 ? initialState.messages[0].tid : 0;
  return dispatch => {
    socket.emit('getchat', {
      shift: shift,
      id: initialState.channelId
    }, (data) => {
      console.log('getchat', initialState, data);
      if (initialState.messages && initialState.messages.length > 0 && initialState.messages[0].tid === data.m[0].tid) {
        console.log('The same messages');
      } else {
        dispatch(getchatCallback(data));
      }
    });
  };
}

export function auth(username, password) {
  console.log('auth', username, password);
  return {
    type: AUTH,
    u: username,
    p: password
  };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case AUTH:
      console.log(AUTH, action);
      socket.emit(AUTH, {
        u: action.u,
        p: md5(action.p)
      });
      return state;

    case WELCOME.api:
      console.log(WELCOME.legacy, action);
      const channel = action.data.channels[0];
      socket.emit('gochannel', { id: channel.id }); // this will trigger 'channeldata' event
      return Object.assign({}, state, {
        channels: action.data.channels,
        channelId: channel.id,
        track: channel.current,
        users: channel.users,
        streamURL: {
          mp3: `http://${channel.name}.trigger.fm/stream/${channel.low}`,
          ogg: `http://${channel.name}.trigger.fm/stream/${channel.hi}`
        }
      });

    case NEWCURRENT.api:
      console.log(NEWCURRENT.legacy, action);
      /* eslint-disable */
      if (state.channelId === action.data.chid) {
        const trackId = state.playlist.findIndex(el => el.id === action.data.track.id);
        if (trackId !== -1) {
          return Object.assign({}, state, {
            track: action.data.track,
            playlist: [
              ...state.playlist.slice(0, trackId),
              ...state.playlist.slice(trackId + 1)
            ].sort(sortFunction)
          });
        }
      }
      return state;
      /* eslint-enable */

    case CHANNELDATA.api:
      console.log(CHANNELDATA.legacy, action);
      const playlist = action.data.pls.sort(sortFunction);
      return Object.assign({}, state, {
        channel: action.data,
        playlist: playlist
      });

    case LOGINSTATUS.api:
      console.log(LOGINSTATUS.legacy, action);
       /* eslint-disable */
      if (action.data.error) {
        return Object.assign({}, state, {
          userStatus: action.data.error
        });
      } else if (action.data.user) {
        return Object.assign({}, state, {
          userStatus: 'success',
          user: action.data.user
        });
      }
      return state;
      /* eslint-enable */

    case TRACKVOTE:
      const { user, channelId } = state;
      socket.emit('vote', {
        id: action.id,
        v: action.vote,
        chid: channelId
      });
      console.log(TRACKVOTE, action, user);
      return state;

    case GETHISTORY:
      socket.emit('gethistory', {
        chid: action.chid,
        a: action.a,
        g: action.g && false,
        s: action.s,
        t: action.t,
        top: action.top && false,
        v: action.v
      }, (data) => {
        console.log(GETHISTORY, this, data);
        gethistoryCallback(data);
        return Object.assign({}, state, {
          history: data
        });
      });
      console.log(GETHISTORY, action);
      return state;

    case 'history':
      console.log('history', action);
      return state;

    case GETHISTORY.callback:
      console.log(GETHISTORY.callback, action);
      /* eslint-disable */
      return Object.assign({}, state, {
        history: action.data
      });
      /* eslint-enable */

    case UPTR.api:
      console.log(UPTR.legacy, action);
      /* eslint-disable */
      if (state.channelId === action.data.chid) {
        if (state.track.id === action.data.t.id) {
          return Object.assign({}, state, {
            track: action.data.t
          });
        } else {
          return Object.assign({}, state, {
            playlist: state.playlist.map((el) => {
              if (el.id === action.data.t.id) {
                return Object.assign({}, el, action.data.t);
              }
              return el;
            }).sort(sortFunction)
          });
        }
      }
      return state;
      /* eslint-enable */

    case ADDTRACK.api:
      console.log(ADDTRACK.legacy, action);
      if (state.channelId === action.data.chid) {
        return Object.assign({}, state, {
          playlist: [...state.playlist, action.data.track].sort(sortFunction)
        });
      }
      return state;

    case LST.api:
      console.log(LST.legacy, action);
      /* eslint-disable */
      if (state.channelId === action.data.chid) {
        return Object.assign({}, state, {
          channel: Object.assign({}, state.channel, {
            a: action.data.a,
            lst: action.data.l
          })
        });
      }
      return state;
      /* eslint-enable */

    case MESSAGE.api:
      console.log(MESSAGE.legacy, action);
      /* eslint-disable */
      if (state.channelId === action.data.chid) {
        return Object.assign({}, state, {
          messages: [...state.messages, action.data]
        });
      }
      return state;
      /* eslint-enable */

    case USUPD.api:
      console.log(USUPD.legacy, action);
      /* eslint-disable */
      if (state.channelId === action.data.chid) {
        return Object.assign({}, state, {
          users: state.users.map((el) => {
            if (el.id === action.data.uid) {
              return Object.assign({}, el, action.data);
            }
            return el;
          })
        });
      }
      return state;
      /* eslint-enable */

    case USER__PUSH.api:
      console.log(USER__PUSH.legacy, action);
      /* eslint-disable */
      if (state.channelId === action.data.chid) {
        if (state.users.findIndex(el => el.id === action.data.uid) === -1) {
          return Object.assign({}, state, {
            users: [...state.users, {
              id: action.data.uid,
              n: action.data.n,
              a: action.data.a
            }]
          });
        }
      }
      return state;
      /* eslint-enable */

    case USER__DELETE.api:
      console.log(USER__DELETE.legacy, action);
      /* eslint-disable */
      if (state.channelId === action.data.chid) {
        const userId = state.users.findIndex(el => el.id === action.data.uid);
        if (userId !== -1) {
          return Object.assign({}, state, {
            users: [
              ...state.users.slice(0, userId),
              ...state.users.slice(userId + 1)
            ]
          });
        }
      }
      return state;
      /* eslint-enable */

    case SENDMESSAGE:
      console.log(SENDMESSAGE, action, this);
      socket.emit('sendmessage', {
        m: action.m
      }, (data) => console.log('sendmessage:callback', data));
      return state;

    case GETCHAT:
      console.log(GETCHAT, action);
      /* eslint-disable */
      const messages = action.data.m;
      if (state.messages.length === 0) {
        return Object.assign({}, state, {
          messages: [
            ...messages
          ]
        });
      } else if (state.messages.length > 0 && state.messages[0].tid !== messages[0].tid) {
        return Object.assign({}, state, {
          messages: [
            ...messages,
            ...state.messages
          ]
        });
      }
      return state;
      /* eslint-enable */

    default:
      return state;
  }
}
