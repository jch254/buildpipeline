variable "region" {
  description = "AWS region to deploy to (e.g. ap-southeast-2)"
}

variable "name" {
  description = "Name of project (used in AWS resource names)"
}

variable "kms_key_arns" {
  description = "Array of KMS Key ARNs used to decrypt secrets specified via ssm_parameter_arns variable"
}

variable "ssm_parameter_arns" {
  description = "Array of SSM Parameter ARNs used to set secret build environment variables via SSM Parameter Store"
}

variable "build_docker_image" {
  description = "Docker image to use as build environment"
}

variable "build_docker_tag" {
  description = "Docker image tag to use as build environment"
}

variable "buildspec" {
  description = "The build spec declaration to use"
}

variable "approval_sns_topic_arn" {
  description = "Approval notifications will be published to the specified SNS topic. Required if require_approval is true."
  default     = ""
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

variable "dns_name" {
  description = "DNS name for app"
}

variable "route53_zone_id" {
  description = "Route 53 Hosted Zone ID"
}

variable "acm_arn" {
  description = "ARN of ACM SSL certificate"
}

variable "cache_bucket" {
  description = "S3 bucket to use as build cache, the value must be a valid S3 bucket name/prefix"
  default     = ""
}

variable "dockerhub_username" {
  description = "Docker Hub username for registry authentication"
  type        = string
  default     = ""
}

variable "dockerhub_token" {
  description = "Docker Hub access token for registry authentication"
  type        = string
  default     = ""
  sensitive   = true
}
