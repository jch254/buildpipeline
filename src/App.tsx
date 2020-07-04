import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Flex } from 'rebass';
import AppFooter from './shared-components/AppFooter';
import FullscreenLoader from './shared-components/FullscreenLoader';
import GaTracker from './shared-components/GaTracker';
import HomePage from './shared-components/HomePage';
import ScrollToTop from './shared-components/ScrollToTop';

// tslint:disable-next-line:space-in-parens
const NotFoundPage = React.lazy(() => import(/* webpackChunkName: "not-found" */'./shared-components/NotFoundPage'));

interface AppProps {
  history: History;
}

const App: React.StatelessComponent<AppProps> = ({ history }) => (
  <ConnectedRouter history={history}>
    <GaTracker>
      <ScrollToTop>
        <Flex flexDirection="column" style={{ height: '100%' }}>
          <React.Suspense fallback={<FullscreenLoader />}>
            <Switch>
              <Route path="/" exact component={HomePage} />
              <Route component={NotFoundPage} />
            </Switch>
          </React.Suspense>
          <AppFooter />
        </Flex>
      </ScrollToTop>
    </GaTracker>
  </ConnectedRouter>
);

export default App;
