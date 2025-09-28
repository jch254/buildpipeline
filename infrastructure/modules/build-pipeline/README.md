# Build-pipeline

## Requirements

| Name      | Version |
| --------- | ------- |
| terraform | >= 0.12 |

## Inputs

| Name                        | Description                                                                                                                                        | Type     | Default                                     | Required |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------- | :------: |
| approval_comment            | Comment to include in approval notifications. Required if require_approval is true.                                                                | `string` | `"A production deploy has been requested."` |    no    |
| approval_sns_topic_arn      | Approval notifications will be published to the specified SNS topic. Required if require_approval is true.                                         | `string` | `""`                                        |    no    |
| build_compute_type          | CodeBuild compute type (e.g. BUILD_GENERAL1_SMALL)                                                                                                 | `string` | `"BUILD_GENERAL1_SMALL"`                    |    no    |
| build_docker_image          | Docker image to use as build environment                                                                                                           | `any`    | n/a                                         |   yes    |
| build_docker_tag            | Docker image tag to use as build environment                                                                                                       | `any`    | n/a                                         |   yes    |
| buildspec                   | The CodeBuild build spec declaration expressed as a single string - see https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html | `any`    | n/a                                         |   yes    |
| cache_bucket                | S3 bucket to use as build cache, the value must be a valid S3 bucket name/prefix                                                                   | `string` | `""`                                        |    no    |
| github_branch_name          | GitHub repository branch to use as CodePipeline source                                                                                             | `any`    | n/a                                         |   yes    |
| github_oauth_token          | OAuth token used to authenticate against CodePipeline source GitHub repository                                                                     | `any`    | n/a                                         |   yes    |
| github_repository_name      | Name of GitHub repository to use as CodePipeline source                                                                                            | `any`    | n/a                                         |   yes    |
| github_repository_owner     | Owner of GitHub repository to use as CodePipeline source                                                                                           | `any`    | n/a                                         |   yes    |
| image_pull_credentials_type | The type of credentials AWS CodeBuild uses to pull images in the build. Valid values for this parameter are: CODEBUILD or SERVICE_ROLE.            | `string` | `"CODEBUILD"`                               |    no    |
| kms_key_arns                | Array of KMS Key ARNs used to decrypt secrets specified via ssm_parameter_arns variable                                                            | `any`    | n/a                                         |   yes    |
| log_retention               | Specifies the number of days to retain build log events                                                                                            | `number` | `90`                                        |    no    |
| name                        | Name of project (used in AWS resource names)                                                                                                       | `any`    | n/a                                         |   yes    |
| privileged_mode             | If set to true, enables running the Docker daemon inside a Docker container                                                                        | `string` | `"false"`                                   |    no    |
| require_approval            | Does the pipeline require approval to run?                                                                                                         | `string` | `"false"`                                   |    no    |
| security_group_ids          | List of security group IDs to assign to running builds                                                                                             | `list`   | `[]`                                        |    no    |
| ssm_parameter_arns          | Array of SSM Parameter ARNs used to set secret build environment variables via SSM Parameter Store                                                 | `any`    | n/a                                         |   yes    |
| subnet_ids                  | List of subnet IDs within which to run builds                                                                                                      | `list`   | `[]`                                        |    no    |
| vpc_id                      | The ID of the VPC within which to run builds                                                                                                       | `string` | `""`                                        |    no    |

## Outputs

| Name                | Description |
| ------------------- | ----------- |
| artifacts_bucket_id | n/a         |
