import * as React from 'react';
import { Box, Heading, Text } from 'rebass';
const banner = require('./Banner.jpg');

const HomePage: React.FC = () => (
  <div>
    <Box
      style={{
        minHeight: '75vh',
        backgroundAttachment: 'scroll',
        backgroundImage: `url(${banner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      m={0}
    >
      <Heading
        textAlign="center"
        color="white"
        fontSize={[6, 7]}
        fontWeight="bold"
        mb={3}
        fontFamily="heading"
      >
        BuildPipeline
      </Heading>
      <Text
        textAlign="center"
        color="white"
        fontSize={[3, 4]}
        mb={2}
        maxWidth="800px"
        lineHeight={1.4}
      >
        AWS-powered serverless build, test and deploy pipeline ft. multiple
        environments
      </Text>
      <Text textAlign="center" color="white" fontSize={[1, 2]} pt={2}>
        {`ENV: ${window.env.DEPLOY_ENV} | VERSION: ${window.env.APP_VERSION}`}
      </Text>
    </Box>
    <Box px={[3, 4, 5]} py={4} maxWidth="1200px" mx="auto">
      <Heading
        pt={4}
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
        React/TypeScript/Webpack-powered web app that is served from S3 with
        CloudFront as a CDN and Route 53 for DNS. The /infrastructure directory
        contains all infrastructure and deployment steps defined as code (
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
        take care of building, testing and deploying the project. All build logs
        are stored in{' '}
        <a
          href="https://aws.amazon.com/cloudwatch"
          target="_blank"
          rel="noopener noreferrer"
        >
          CloudWatch
        </a>
        . CodePipeline accesses GitHub using an access token.
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
        uses to build, test and deploy - A.K.A. a Docker image. I maintain build
        environments for the programming languages and tools I use frequently -
        e.g.{' '}
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
        stored at the root level of the project. Because a buildspec declaration
        must be valid YAML, the spacing in a buildspec declaration is important.
        If the number of spaces in a buildspec declaration is invalid builds
        might fail immediately. A YAML validator can be used to test whether a
        buildspec declaration is valid YAML. See{' '}
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
      <Text fontSize={[2, 3]} lineHeight="copy" color="text">
        {window.env.DEPLOY_ENV === 'production' ? (
          <a href="https://buildpipeline-test.603.nz">View test env</a>
        ) : (
          <a href="https://buildpipeline-prod.603.nz">View production env</a>
        )}
      </Text>
    </Box>
  </div>
);

export default HomePage;
