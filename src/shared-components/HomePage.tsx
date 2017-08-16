import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  Banner,
  Container,
  Heading,
  Section,
  SectionHeader,
} from 'rebass';

const banner = require('./Banner.jpg');

const HomePage: React.StatelessComponent<RouteComponentProps<any>> = () => (
  <div>
    <Banner
      style={{ minHeight: '75vh', backgroundAttachment: 'scroll' }}
      backgroundImage={banner}
      m={0}
    >
      <Heading size={1} big>
        CodePipeline POC
      </Heading>
      <Heading size={2}>
        AWS-powered build, test and deploy pipeline ft. multiple environments
      </Heading>
    </Banner>
    <Container pb={3}>
      <Section pb={0}>
        <SectionHeader heading="About" />
        <p style={{ fontSize: '20px' }}>
          TODO: Overview of project lives here
        </p>
        <p style={{ fontSize: '20px' }}>
          {`Deploy env: ${window.env.DEPLOY_ENV}`}
          {`Version: ${window.env.APP_VERSION}`}
        </p>
      </Section>
    </Container>
  </div>
);

export default HomePage;
