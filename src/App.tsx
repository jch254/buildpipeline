import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Flex } from 'rebass';
import AppFooter from './shared-components/AppFooter';
import FullscreenLoader from './shared-components/FullscreenLoader';
import HomePage from './shared-components/HomePage';

const NotFoundPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "not-found" */ './shared-components/NotFoundPage'
    ),
);

const App: React.FC = () => (
  <BrowserRouter>
    <Flex flexDirection="column" style={{ height: '100%' }}>
      <React.Suspense fallback={<FullscreenLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </React.Suspense>
      <AppFooter />
    </Flex>
  </BrowserRouter>
);

export default App;
