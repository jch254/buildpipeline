terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    template = {
      source  = "hashicorp/template"
      version = "~> 2.2"
    }
  }
  
  backend "s3" {
    encrypt = "true"
  }
}

provider "aws" {
  region = var.region
}

# Docker Hub credentials for pulling build images
resource "aws_secretsmanager_secret" "dockerhub_credentials" {
  name                    = "${var.name}-dockerhub-credentials"
  description             = "Docker Hub credentials for CodeBuild image pulls"
  recovery_window_in_days = 0 # For immediate deletion in dev/test environments
}

resource "aws_secretsmanager_secret_version" "dockerhub_credentials" {
  secret_id = aws_secretsmanager_secret.dockerhub_credentials.id
  secret_string = jsonencode({
    username = var.dockerhub_username
    password = var.dockerhub_token
  })
}

module "build_pipeline" {
  source = "./modules/build-pipeline"

  name                      = var.name
  kms_key_arns              = var.kms_key_arns
  ssm_parameter_arns        = var.ssm_parameter_arns
  build_docker_image        = var.build_docker_image
  build_docker_tag          = var.build_docker_tag
  buildspec                 = var.buildspec
  require_approval          = var.github_branch_name == "production" ? "true" : "false"
  approval_sns_topic_arn    = var.approval_sns_topic_arn
  github_connection_arn     = var.github_connection_arn
  github_repository_owner   = var.github_repository_owner
  github_repository_name    = var.github_repository_name
  github_branch_name        = var.github_branch_name
  cache_bucket              = var.cache_bucket
  dockerhub_credentials_arn = var.dockerhub_username != "" ? aws_secretsmanager_secret.dockerhub_credentials.arn : ""
}

module "web_app" {
  source = "./modules/web-app"

  dns_name        = var.dns_name
  route53_zone_id = var.route53_zone_id
  acm_arn         = var.acm_arn
}
