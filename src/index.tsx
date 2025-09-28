import { ThemeProvider } from '@emotion/react';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './configureStore';

// Simple theme for rebass v4
const theme = {
  colors: {
    primary: '#07c',
    secondary: '#30c',
    text: '#333',
    background: '#fff',
  },
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72, 96],
  space: [0, 4, 8, 16, 32, 64, 128, 256],
  lineHeights: {
    solid: 1,
    title: 1.25,
    copy: 1.5,
  },
};

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

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
);
