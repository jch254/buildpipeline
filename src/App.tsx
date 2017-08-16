import { History } from 'history';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Flex } from 'reflexbox';

import AppFooter from './shared-components/AppFooter';
import HomePage from './shared-components/HomePage';
import NotFoundPage from './shared-components/LoadableNotFoundPage';
import ScrollToTop from './shared-components/ScrollToTop';

interface AppProps {
  history: History;
}

const App: React.StatelessComponent<AppProps> = ({ history }) => (
  <ConnectedRouter history={history}>
    <ScrollToTop>
      <Flex column style={{ height: '100%' }}>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route component={NotFoundPage} />
        </Switch>
        <AppFooter />
      </Flex>
    </ScrollToTop>
  </ConnectedRouter>
);

export default App;
