# Build-pipeline

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|:----:|:-----:|:-----:|
| approval\_comment | Comment to include in approval notifications. Required if require_approval is true. | string | `"A production deploy has been requested."` | no |
| approval\_sns\_topic\_arn | Approval notifications will be published to the specified SNS topic. Required if require_approval is true. | string | `""` | no |
| build\_compute\_type | CodeBuild compute type (e.g. BUILD_GENERAL1_SMALL) | string | `"BUILD_GENERAL1_SMALL"` | no |
| build\_docker\_image | Docker image to use as build environment | string | n/a | yes |
| build\_docker\_tag | Docker image tag to use as build environment | string | n/a | yes |
| buildspec | The CodeBuild build spec declaration expressed as a single string - see https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html | string | n/a | yes |
| cache\_bucket | S3 bucket to use as build cache, the value must be a valid S3 bucket name/prefix | string | `""` | no |
| github\_branch\_name | GitHub repository branch to use as CodePipeline source | string | n/a | yes |
| github\_oauth\_token | OAuth token used to authenticate against CodePipeline source GitHub repository | string | n/a | yes |
| github\_repository\_name | Name of GitHub repository to use as CodePipeline source | string | n/a | yes |
| github\_repository\_owner | Owner of GitHub repository to use as CodePipeline source | string | n/a | yes |
| kms\_key\_arns | Array of KMS Key ARNs used to decrypt secrets specified via ssm_parameter_arns variable | string | n/a | yes |
| log\_retention | Specifies the number of days to retain build log events | string | `"90"` | no |
| name | Name of project (used in AWS resource names) | string | n/a | yes |
| privileged\_mode | If set to true, enables running the Docker daemon inside a Docker container | string | `"false"` | no |
| require\_approval | Does the pipeline require approval to run? | string | `"false"` | no |
| ssm\_parameter\_arns | Array of SSM Parameter ARNs used to set secret build environment variables via SSM Parameter Store | string | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| artifacts\_bucket\_id |  |
