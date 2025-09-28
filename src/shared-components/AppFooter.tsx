import moment from 'moment';
import * as React from 'react';
import { Box, Text } from 'rebass';

const AppFooter: React.FC = () => (
  <Box bg="white" p={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <Text fontSize={1}>
      <a href="https://603.nz" style={{ cursor: 'pointer', color: 'black' }}>
        {`SECRET: ${window.env.APP_SECRET} | © 603.nz ${moment().year()}`}
      </a>
    </Text>
  </Box>
);

export default AppFooter;
