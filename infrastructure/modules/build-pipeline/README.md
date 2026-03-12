# Build-pipeline

## Requirements

- Terraform: `>= 1.0`

## Inputs

- `approval_comment`: Comment to include in approval notifications. Default: `A production deploy has been requested.`
- `build_compute_type`: CodeBuild compute type. Default: `BUILD_GENERAL1_SMALL`
- `build_docker_image`: Docker image to use as the build environment.
- `build_docker_tag`: Docker image tag to use as the build environment.
- `buildspec`: CodeBuild build spec declaration as a single string.
- `cache_bucket`: S3 bucket/prefix to use as the build cache. Default: empty.
- `github_branch_name`: GitHub repository branch to use as the CodePipeline source.
- `github_connection_arn`: ARN of the GitHub App connection for CodePipeline source authentication.
- `github_repository_name`: GitHub repository name to use as the CodePipeline source.
- `github_repository_owner`: GitHub repository owner to use as the CodePipeline source.
- `image_pull_credentials_type`: Credential source CodeBuild uses to pull the build image. Default: `CODEBUILD`.
- `kms_key_arns`: Array of KMS key ARNs used to decrypt secrets referenced by `ssm_parameter_arns`.
- `log_retention`: Number of days to retain build log events. Default: `90`.
- `name`: Project name used in AWS resource names.
- `privileged_mode`: Enables running the Docker daemon inside the build container. Default: `false`.
- `require_approval`: Whether the pipeline requires approval to run. Default: `false`.
- `security_group_ids`: Security groups to assign to running builds. Default: empty list.
- `ssm_parameter_arns`: Array of SSM Parameter ARNs used for secret build environment variables.
- `subnet_ids`: Subnets within which to run builds. Default: empty list.
- `vpc_id`: VPC ID within which to run builds. Default: empty.

## Outputs

- `artifacts_bucket_id`
- `codebuild_role_arn`
- `codebuild_role_unique_id`
