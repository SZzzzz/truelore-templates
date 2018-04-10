import * as React from 'react';
import { Provider } from 'mobx-react';
import * as allStores from './stores';
import { isDev } from './utils';
import DevTools from 'mobx-react-devtools';
import { Router, Route } from 'react-router';
import Home from './pages/home/Home';
import { createHashHistory } from 'history';
import { syncHistoryWithStore } from 'mobx-react-router';
import './App.scss';

const hashHistory = createHashHistory();
const history = syncHistoryWithStore(hashHistory, allStores.routingStore);

const devtools = isDev ? <DevTools/> : null;

export default class App extends React.Component {
  render() {
    return (
        <Provider {...allStores}>
          <Router history={history}>
            <div className="app-container">
                {devtools}
                <Route path="/" exact={true} component={Home}/>
            </div>
          </Router>
        </Provider>
    );
  }
}

