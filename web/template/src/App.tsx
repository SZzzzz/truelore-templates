import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import * as allStores from './stores';
import { Router, Route } from 'react-router';
import Home from './pages/home/Home';
import { createHashHistory } from 'history';
import { syncHistoryWithStore } from 'mobx-react-router';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import Devtools from 'mobx-react-devtools'
import './App.scss';

const devtools = process.env.NODE_ENV === 'development' ? <Devtools/> : null;
const hashHistory = createHashHistory();
const history = syncHistoryWithStore(hashHistory, allStores.routingStore);

export default class App extends Component {
  render() {
    return (
      <Provider {...allStores}>
        <Router history={history}>
          <LocaleProvider locale={zh_CN}>
            <div id="app">
              {devtools}
              <Route path="/" exact={true} component={Home}/>
            </div>
          </LocaleProvider>
        </Router>
      </Provider>
    );
  }
}

