import React from 'react';
import { IndexRoute, Route } from 'react-router';
// import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    App,
    Chat,
    Home,
    Widgets,
    About,
    Login,
    LoginSuccess,
    Survey,
    NotFound,
    Tabs,
    TabsContent1,
    TabsContent2,
    TabsContent3,
    TabsContent4,
    TabsContent5,
    TabsContent6,
    TabsContent7,
    TabsContent8,
    TabsContent9,
    Channel,
    History,
    Playlist,
    Auth,
    Start,
  } from 'containers';

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    const { app: { userStatus }} = store.getState();
    if (!userStatus) {
      // oops, not logged in, so can't be here!
      replace('/');
    }
    cb();
//    function checkAuth() {
//    }

//    if (!isAuthLoaded(store.getState())) {
//      store.dispatch(loadAuth()).then(checkAuth);
//    } else {
//      checkAuth();
//    }
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Start}/>

      { /* Routes requiring login */ }
      <Route onEnter={requireLogin}>
        <Route path="chat" component={Chat}/>
        <Route path="loginSuccess" component={LoginSuccess}/>

        <Route path="channel" component={Channel}>
          <Route path=":channelName" component={Tabs}>
            <Route path="playlist" component={Playlist}/>
            <Route path="chat" component={Chat}/>
            <Route path="history" component={History}/>
          </Route>
        </Route>

        <Route path="tabs" component={Tabs}>
          <Route path="1" component={TabsContent1}/>
          <Route path="2" component={TabsContent2}/>
          <Route path="3" component={TabsContent3}/>
          <Route path="4" component={TabsContent4}/>
          <Route path="5" component={TabsContent5}/>
          <Route path="6" component={TabsContent6}/>
          <Route path="7" component={TabsContent7}/>
          <Route path="8" component={TabsContent8}/>
          <Route path="9" component={TabsContent9}/>
        </Route>
        { /* Routes */ }
        <Route path="start" component={Start}/>
        <Route path="home" component={Home}/>
        <Route path="about" component={About}/>
        <Route path="login" component={Login}/>
        <Route path="survey" component={Survey}/>
        <Route path="widgets" component={Widgets}/>
      </Route>

      <Route path="auth" component={Auth}/>

      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
