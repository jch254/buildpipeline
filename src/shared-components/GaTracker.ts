import * as React from 'react';
import * as ga from 'react-ga';
import { useLocation } from 'react-router-dom';

interface GaTrackerProps {
  children?: any;
}

const GaTracker: React.FC<GaTrackerProps> = ({ children }) => {
  const location = useLocation();

  React.useEffect(() => {
    if (
      process.env.NODE_ENV === 'production' &&
      window.env.GA_ID !== undefined
    ) {
      ga.initialize(window.env.GA_ID);
    }
  }, []);

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      ga.pageview(location.pathname);
    }
  }, [location]);

  return children;
};

export default GaTracker;
