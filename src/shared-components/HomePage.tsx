import * as React from 'react';
import { Box, Heading, Text } from 'rebass';
const banner = require('./Banner.jpg') as string;

const HomePage: React.FC = () => (
  <div>
    <Box
      style={{
        minHeight: '78vh',
        backgroundAttachment: 'scroll',
        backgroundImage: `url(${banner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1.25rem',
      }}
      m={0}
    >
      <Box
        style={{
          width: '100%',
          maxWidth: '820px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          textAlign: 'center',
          padding: '2.25rem 1.5rem',
          borderRadius: '24px',
          backgroundColor: 'rgba(4, 12, 18, 0.58)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <Heading
          textAlign="center"
          color="white"
          fontSize={[6, 7]}
          fontWeight="bold"
          mb={0}
          fontFamily="heading"
        >
          BuildPipeline
        </Heading>
        <Text
          textAlign="center"
          color="white"
          fontSize={[3, 4]}
          mb={0}
          maxWidth="760px"
          lineHeight={1.35}
        >
          AWS-powered serverless build, test and deploy pipeline ft. multiple
          environments
        </Text>
        <Box
          className="hero-pill-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'nowrap',
            gap: '0.75rem',
            width: '100%',
            maxWidth: '760px',
          }}
        >
          <Box
            className="hero-pill"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '1 1 0',
              minWidth: 0,
              padding: '0.45rem 0.8rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <Text color="white" fontSize={[0, 1]} mb={0} style={{ whiteSpace: 'nowrap' }}>
              {`APP SECRET: ${window.env.APP_SECRET}`}
            </Text>
          </Box>
          <Box
            className="hero-pill"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '1 1 0',
              minWidth: 0,
              padding: '0.45rem 0.8rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <Text color="white" fontSize={[0, 1]} mb={0} style={{ whiteSpace: 'nowrap' }}>
              {`ENV: ${window.env.DEPLOY_ENV}`}
            </Text>
          </Box>
          <Box
            className="hero-pill"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '1 1 0',
              minWidth: 0,
              padding: '0.45rem 0.8rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <Text color="white" fontSize={[0, 1]} mb={0} style={{ whiteSpace: 'nowrap' }}>
              {`VERSION: ${window.env.APP_VERSION}`}
            </Text>
          </Box>
        </Box>
        <a
          href={
            window.env.DEPLOY_ENV === 'production'
              ? 'https://buildpipeline--test.603.nz'
              : 'https://buildpipeline--prod.603.nz'
          }
          style={{
            marginTop: '0.5rem',
            display: 'inline-block',
            padding: '0.85rem 1.4rem',
            borderRadius: '999px',
            backgroundColor: '#ffffff',
            color: '#111111',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          {window.env.DEPLOY_ENV === 'production'
            ? 'View test environment'
            : 'View production environment'}
        </a>
      </Box>
    </Box>
    <Box px={[3, 4, 5]} py={[4, 5]} maxWidth="1200px" mx="auto">
      <Heading
        pt={2}
        pb={3}
        fontSize={[4, 5]}
        color="text"
        fontFamily="heading"
      >
        Overview
      </Heading>
      <Text fontSize={[2, 3]} lineHeight="copy" mb={4} color="text">
        This project demonstrates an AWS-powered serverless build, test and
        deploy pipeline ft. multiple environments. The /src directory contains a
        React/TypeScript/Webpack-powered web app that is served from a private
        S3 bucket through CloudFront, with DNS managed in Cloudflare. The
        /infrastructure directory contains all infrastructure and deployment
        steps defined as code (
        <a
          href="https://www.terraform.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terraform
        </a>{' '}
        and bash scripts).{' '}
        <a
          href="https://aws.amazon.com/codebuild"
          target="_blank"
          rel="noopener noreferrer"
        >
          CodeBuild
        </a>{' '}
        and{' '}
        <a
          href="https://aws.amazon.com/codepipeline"
          target="_blank"
          rel="noopener noreferrer"
        >
          CodePipeline
        </a>{' '}
        take care of building, testing and deploying the project. GitHub access
        is handled through{' '}
        <a
          href="https://docs.aws.amazon.com/dtconsole/latest/userguide/connections.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          AWS CodeConnections
        </a>{' '}
        and deployment secrets are read from AWS Systems Manager Parameter
        Store. All build logs are stored in{' '}
        <a
          href="https://aws.amazon.com/cloudwatch"
          target="_blank"
          rel="noopener noreferrer"
        >
          CloudWatch
        </a>
        .
      </Text>
      <Text fontSize={[2, 3]} lineHeight="copy" mb={4} color="text">
        When using CodeBuild to build, test and deploy each project, information
        about the{' '}
        <a
          href="http://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          build environment
        </a>{' '}
        must be provided. A build environment represents a combination of
        operating system, programming language runtime, and tools that CodeBuild
        uses to build, test and deploy. In this demo, those environments are
        versioned Docker images stored in Amazon ECR, for example{' '}
        <a
          href="https://github.com/jch254/docker-node-terraform-aws"
          target="_blank"
          rel="noopener noreferrer"
        >
          docker-node-terraform-aws
        </a>
        . The build commands and related settings must also be specified in a{' '}
        <a
          href="http://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          buildspec declaration
        </a>{' '}
        stored at the root level of the project. The test environment builds,
        tests, deploys infrastructure, and uploads the app automatically. The
        production branch follows the same flow with a manual approval gate
        before deployment. See{' '}
        <a
          href="http://docs.aws.amazon.com/codebuild/latest/userguide/concepts.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          AWS CodeBuild Concepts
        </a>{' '}
        and{' '}
        <a
          href="http://docs.aws.amazon.com/codebuild/latest/userguide/view-build-details.html#view-build-details-phases"
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          Build Phase Transitions
        </a>{' '}
        for further information.
      </Text>
      <Text fontSize={[2, 3]} lineHeight="copy" mb={4} color="text">
        This project can be updated as needed to build many different types of
        project. If a project needs to build Docker images/interact with the
        Docker daemon the Privileged flag under advanced settings of the
        CodeBuild project in AWS console must be set to true. This can also be
        set to true using the privileged_mode variable of the build-pipeline
        module. The buildspec declaration must also start the Docker daemon and
        wait for it to become interactive.
      </Text>
      <Text fontSize={[2, 3]} lineHeight="copy" mb={4} color="text">
        Check out{' '}
        <a
          href="https://github.com/jch254/buildpipeline/blob/master/README.md"
          target="blank"
          rel="noopener noreferrer"
        >
          README.md
        </a>{' '}
        for more details.
      </Text>
    </Box>
  </div>
);

export default HomePage;
