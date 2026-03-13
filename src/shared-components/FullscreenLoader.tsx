import * as React from 'react';
import Loading from 'react-loading';
import { Flex } from 'rebass';

interface FullscreenLoaderProps {
  delay?: number;
  style?: React.CSSProperties;
}

const FullscreenLoader = ({ delay, style = {} }: FullscreenLoaderProps) => (
  <Flex
    alignItems="center"
    justifyContent="center"
    style={{ flex: 'auto', ...style }}
  >
    <Loading delay={delay} type="spinningBubbles" color="#111" />
  </Flex>
);

export default FullscreenLoader;
