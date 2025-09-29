# BuildPipeline

Test: [test env](https://buildpipeline-test.603.nz) | Prod: [production env](https://buildpipeline-prod.603.nz)

## Overview

BuildPipeline is an AWS-backed, fully scripted build → test → deploy pipeline with separate test & production environments. The frontend (React + TypeScript + Webpack) is served from S3 behind CloudFront & Route53. Infrastructure and deployment flow are defined as code in Terraform plus a small set of Bash scripts. CodeBuild + CodePipeline orchestrate builds, tests, artifact packaging and promoted releases. Logs: CloudWatch. Secrets: SSM Parameter Store.

## High‑level Flow

1. Push to master → test env pipeline: build, test, synth/apply infra, upload & deploy assets
2. Promote: merge master → production branch
3. Manual approval gate in CodePipeline
4. Production deploy: infra apply (no rebuild/tests) + asset promotion

## Tech Stack

- Frontend: React, TypeScript, Webpack 5, Rebass v4 (@emotion theme), Redux + Sagas
- Quality: ESLint 9 flat config, TypeScript strict-ish, Prettier (via ESLint)
- Infra: Terraform modules (`/infrastructure` + nested modules), Bash helpers
- CI/CD: AWS CodeBuild, CodePipeline, S3, CloudFront, Route53, CloudWatch Logs
- Secrets: SSM Parameter Store (SecureString)

## Key Terraform Modules

Located under `infrastructure/modules/` (e.g. `build-pipeline`, `web-app`). Modules encapsulate repeatable infra (pipelines, IAM, hosting). State + buildspec files are per-environment to allow environment‑specific steps.

## Secrets (Parameter Store)

Naming convention:

- Shared: `/shared/SECRET_NAME`
- CodeBuild: `/codebuild/PROJECT/SECRET_NAME`
- App: `/{PROJECT}/SECRET_NAME`

Basic CLI examples:

```sh
aws ssm put-parameter --region <REGION> --name "/codebuild/PROJECT/SECRET" --value "VALUE" --type SecureString --key-id <KMS_KEY_ID>
aws ssm get-parameters --region <REGION> --name "/codebuild/PROJECT/SECRET" --with-decryption --query 'Parameters[0].Value' --output text
```

## Environments & Deployment

- master branch → test automatically
- production branch → prod after manual approval (reduces accidental releases / coordinates timing)
- Separate buildspec + state per environment
- Production skips build & tests: only infra apply + artifact deploy

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
