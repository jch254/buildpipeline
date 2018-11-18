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

variable "github_oauth_token" {
  description = "OAuth token used to authenticate against CodePipeline source GitHub repository"
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
