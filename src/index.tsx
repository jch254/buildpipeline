import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Provider as RebassProvider } from 'rebass';
import App from './App';
import configureStore, { history } from './configureStore';

import './index.css';

// Add ES6 Map support for redux-devtools-extension
// See: https://github.com/zalmoxisus/redux-devtools-extension/issues/124
if (process.env.NODE_ENV !== 'production') {
  require('map.prototype.tojson');
}

const store = configureStore();

declare global {
  interface Window {
    devToolsExtension: any;
    env: {
      DEPLOY_ENV: string;
      APP_VERSION: string;
      APP_SECRET: string;
      GA_ID: string;
    };
  }
}

ReactDOM.render(
  <Provider store={store}>
    <RebassProvider id="provider">
      <App history={history} />
    </RebassProvider>
  </Provider>,
  document.getElementById('root'),
);
