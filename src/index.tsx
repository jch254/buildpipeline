import createBrowserHistory from 'history/createBrowserHistory';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import { configureStore } from './configureStore';

import './index.css';

const history = createBrowserHistory();
const store = configureStore(history);

declare global {
  interface Window {
    devToolsExtension: any;
    env: {
      DEPLOY_ENV: string;
      APP_VERSION: string;
      APP_SECRET: string;
    };
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('root'),
);


