# Build-pipeline

## Requirements

| Name | Version |
|------|---------|
| terraform | >= 0.12 |
| aws | ~> 2.0 |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| approval\_comment | Comment to include in approval notifications. Required if require\_approval is true. | `string` | `"A production deploy has been requested."` | no |
| approval\_sns\_topic\_arn | Approval notifications will be published to the specified SNS topic. Required if require\_approval is true. | `string` | `""` | no |
| build\_compute\_type | CodeBuild compute type (e.g. BUILD\_GENERAL1\_SMALL) | `string` | `"BUILD_GENERAL1_SMALL"` | no |
| build\_docker\_image | Docker image to use as build environment | `any` | n/a | yes |
| build\_docker\_tag | Docker image tag to use as build environment | `any` | n/a | yes |
| buildspec | The CodeBuild build spec declaration expressed as a single string - see https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html | `any` | n/a | yes |
| cache\_bucket | S3 bucket to use as build cache, the value must be a valid S3 bucket name/prefix | `string` | `""` | no |
| github\_branch\_name | GitHub repository branch to use as CodePipeline source | `any` | n/a | yes |
| github\_oauth\_token | OAuth token used to authenticate against CodePipeline source GitHub repository | `any` | n/a | yes |
| github\_repository\_name | Name of GitHub repository to use as CodePipeline source | `any` | n/a | yes |
| github\_repository\_owner | Owner of GitHub repository to use as CodePipeline source | `any` | n/a | yes |
| image\_pull\_credentials\_type | The type of credentials AWS CodeBuild uses to pull images in the build. Valid values for this parameter are: CODEBUILD or SERVICE\_ROLE. | `string` | `"CODEBUILD"` | no |
| kms\_key\_arns | Array of KMS Key ARNs used to decrypt secrets specified via ssm\_parameter\_arns variable | `any` | n/a | yes |
| log\_retention | Specifies the number of days to retain build log events | `number` | `90` | no |
| name | Name of project (used in AWS resource names) | `any` | n/a | yes |
| privileged\_mode | If set to true, enables running the Docker daemon inside a Docker container | `string` | `"false"` | no |
| require\_approval | Does the pipeline require approval to run? | `string` | `"false"` | no |
| security\_group\_ids | List of security group IDs to assign to running builds | `list` | `[]` | no |
| ssm\_parameter\_arns | Array of SSM Parameter ARNs used to set secret build environment variables via SSM Parameter Store | `any` | n/a | yes |
| subnet\_ids | List of subnet IDs within which to run builds | `list` | `[]` | no |
| vpc\_id | The ID of the VPC within which to run builds | `string` | `""` | no |

## Outputs

| Name | Description |
|------|-------------|
| artifacts\_bucket\_id | n/a |
