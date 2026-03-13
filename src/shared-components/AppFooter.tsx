import moment from 'moment';
import * as React from 'react';
import { Box, Text } from 'rebass';

const AppFooter: React.FC = () => (
  <Box bg="white" p={3} style={{ display: 'flex', justifyContent: 'center' }}>
    <Box className="app-footer" style={{ textAlign: 'center' }}>
      <Text className="app-footer__item" fontSize={1}>
        <a href="https://603.nz" target="_blank" rel="noreferrer" style={{ cursor: 'pointer', color: 'black' }}>
          {`© 603.nz ${moment().year()}`}
        </a>
      </Text>
      |
      <Text className="app-footer__item" fontSize={1}>
        <a
          href="https://github.com/jch254/buildpipeline"
          target="_blank"
          rel="noreferrer"
          style={{ cursor: 'pointer', color: 'black' }}
        >
          Source on GitHub
        </a>
      </Text>
    </Box>
  </Box>
);

export default AppFooter;
