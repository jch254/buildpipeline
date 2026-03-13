# BuildPipeline

Test: [test env](https://buildpipeline--test.603.nz) | Prod: [production env](https://buildpipeline--prod.603.nz)

## Overview

BuildPipeline is an AWS-backed, fully scripted build → test → deploy pipeline with separate test and production environments. The frontend (React + TypeScript + Webpack) is served from S3 behind CloudFront, with project subdomains managed in Cloudflare. Infrastructure and deployment flow are defined as code in Terraform plus a small set of Bash scripts. CodeBuild and CodePipeline orchestrate builds, tests, artifact packaging, and promoted releases. Logs go to CloudWatch. Only actual deployment/runtime secrets remain in SSM Parameter Store.

## High‑level Flow

1. Push to master → test env pipeline: build, test, apply infra, upload and deploy assets
2. Promote: merge master → production branch
3. Manual approval gate in CodePipeline
4. Production deploy: infra apply (no rebuild/tests) and asset promotion

## Tech Stack

- Frontend: React, TypeScript, Webpack 5, Rebass v4 (@emotion theme), Redux + Sagas
- Quality: ESLint 9 flat config, TypeScript strict-ish, Prettier (via ESLint)
- Infra: Terraform modules (`/infrastructure` + nested modules), Bash helpers
- CI/CD: AWS CodeBuild, CodePipeline, S3, CloudFront, Cloudflare DNS, CloudWatch Logs
- Secrets: SSM Parameter Store (SecureString) for deployment/runtime secrets only
- Build Images: ECR-hosted `docker-node-terraform-aws:22.x` for test and `dind-terraform-aws:v1.13.3` for prod

## CodeBuild Image Guardrail

Production CodeBuild in this repo runs on the standard `LINUX_CONTAINER` environment, so the configured runtime image must include `linux/amd64`. An arm64-only image will fail during the CodeBuild `PROVISIONING` phase before `buildspec-prod.yml` starts.

Before changing the prod build image tag, verify the target image manifest:

```sh
./infrastructure/check-codebuild-image-platform.bash \
	352311918919.dkr.ecr.ap-southeast-2.amazonaws.com/dind-terraform-aws:v1.13.3
```

For a private ECR image, authenticate Docker first:

```sh
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 352311918919.dkr.ecr.ap-southeast-2.amazonaws.com
```

## Key Terraform Modules

Located under `infrastructure/modules/` (e.g. `build-pipeline`, `web-app`). Modules encapsulate repeatable infra (pipelines, IAM, hosting). State + buildspec files are per-environment to allow environment‑specific steps.

## Secrets (Parameter Store)

Naming convention:

- Repo scoped: `/buildpipeline/SECRET_NAME`
- Environment specific: `/buildpipeline/SECRET_NAME-test` or `/buildpipeline/SECRET_NAME-prod`

Current secrets used by this repo:

- `/buildpipeline/cloudflare-api-token`
- `/buildpipeline/app-secret-test`
- `/buildpipeline/app-secret-prod`

Basic CLI examples:

```sh
aws ssm put-parameter --region <REGION> --name "/buildpipeline/cloudflare-api-token" --value "VALUE" --type SecureString --key-id <KMS_KEY_ID>
aws ssm get-parameters --region <REGION> --name "/buildpipeline/cloudflare-api-token" --with-decryption --query 'Parameters[0].Value' --output text
```

## Environments & Deployment

- master branch → test automatically
- production branch → prod after manual approval (reduces accidental releases / coordinates timing)
- Separate buildspec + state per environment
- Production skips build & tests: only infra apply + artifact deploy
- First deploy in a new account/environment is run locally via `./infrastructure/bootstrap-deploy.bash <test|prod>`, after which CodeBuild takes over
- Current demo URLs: `buildpipeline--test.603.nz` and `buildpipeline--prod.603.nz`

## GitHub Connection Setup

AWS CodePipeline uses AWS CodeConnections for GitHub source access. When creating a new GitHub connection in AWS, install the GitHub app from the CodeConnections flow and grant it access to the `jch254/buildpipeline` repository. Repository access is repo-scoped, not branch-scoped, so a valid installation covers both `master` and `production`. After creating a replacement connection, update `TF_VAR_github_connection_arn` in both buildspecs and run one manual test pipeline execution so Terraform can roll the new connection ARN into the deployed pipelines.

## Optional Docker Builds

If building Docker images, enable privileged mode (CodeBuild project or module variable) and start the daemon early in the buildspec:

```sh
nohup /usr/local/bin/dockerd --host=unix:///var/run/docker.sock --host=tcp://0.0.0.0:2375 --storage-driver=overlay &
timeout -t 15 sh -c "until docker info; do echo .; sleep 1; done"
```

## Caching

Provide `cache_bucket` Terraform variable → CodeBuild layer caches (see `buildspec-test.yml`).

## Local Development

```sh
pnpm install
pnpm dev          # http://localhost:3001 (hot reload)
```

## Production Build

```sh
pnpm install
pnpm build        # outputs to /dist
```

## Run Production Locally

```sh
pnpm install
pnpm prod         # serves built assets
```

## Recent Modernization

- Migrated to ESLint 9 flat config; removed legacy TSLint remnants
- Aligned React Router to v6 (was mixed with v7 bits)
- Rebass v4 migration + unified @emotion ThemeProvider
- Added safe runtime env fallbacks (DEPLOY_ENV, APP_VERSION)
- Simplified Home page layout; consistent spacing & typography

## Roadmap / TODO

- Cross-account production deployment pattern
- Extended build notifications (Lambda → Slack/webhook)
- Additional reusable infra modules

## Infrastructure Reference

See `./infrastructure` for Terraform root modules, helper scripts and environment state layout.

---

MIT License
