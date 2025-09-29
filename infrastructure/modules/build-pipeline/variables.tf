variable "name" {
  description = "Name of project (used in AWS resource names)"
}

variable "log_retention" {
  description = "Specifies the number of days to retain build log events"
  default     = 90
}

variable "kms_key_arns" {
  description = "Array of KMS Key ARNs used to decrypt secrets specified via ssm_parameter_arns variable"
}

variable "ssm_parameter_arns" {
  description = "Array of SSM Parameter ARNs used to set secret build environment variables via SSM Parameter Store"
}

variable "build_compute_type" {
  description = "CodeBuild compute type (e.g. BUILD_GENERAL1_SMALL)"
  default     = "BUILD_GENERAL1_SMALL"
}

variable "build_docker_image" {
  description = "Docker image to use as build environment"
}

variable "build_docker_tag" {
  description = "Docker image tag to use as build environment"
}

variable "buildspec" {
  description = "The CodeBuild build spec declaration expressed as a single string - see https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html"
}

variable "require_approval" {
  description = "Does the pipeline require approval to run?"
  default     = "false"
}

variable "approval_sns_topic_arn" {
  description = "Approval notifications will be published to the specified SNS topic. Required if require_approval is true."
  default     = ""
}

variable "approval_comment" {
  description = "Comment to include in approval notifications. Required if require_approval is true."
  default     = "A production deploy has been requested."
}

variable "github_connection_arn" {
  description = "ARN of the GitHub App connection for CodePipeline source authentication"
}

variable "github_repository_owner" {
  description = "Owner of GitHub repository to use as CodePipeline source"
}

variable "github_repository_name" {
  description = "Name of GitHub repository to use as CodePipeline source"
}

variable "github_branch_name" {
  description = "GitHub repository branch to use as CodePipeline source"
}

variable "privileged_mode" {
  description = "If set to true, enables running the Docker daemon inside a Docker container"
  default     = "false"
}

variable "cache_bucket" {
  description = "S3 bucket to use as build cache, the value must be a valid S3 bucket name/prefix"
  default     = ""
}

variable "image_pull_credentials_type" {
  description = "The type of credentials AWS CodeBuild uses to pull images in the build. Valid values for this parameter are: CODEBUILD or SERVICE_ROLE."
  default     = "CODEBUILD"
}

variable "vpc_id" {
  description = "The ID of the VPC within which to run builds"
  default     = ""
}

variable "subnet_ids" {
  description = "List of subnet IDs within which to run builds"
  default     = []
}

variable "security_group_ids" {
  description = "List of security group IDs to assign to running builds"
  default     = []
}

variable "dockerhub_credentials_arn" {
  description = "ARN of AWS Secrets Manager secret containing Docker Hub credentials"
  type        = string
  default     = ""
}
