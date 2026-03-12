provider "aws" {
  region = var.region
}

provider "cloudflare" {}

# Get current AWS account ID for ECR repository references
data "aws_caller_identity" "current" {}

module "build_pipeline" {
  source = "./modules/build-pipeline"

  name                    = var.name
  kms_key_arns            = var.kms_key_arns
  ssm_parameter_arns      = var.ssm_parameter_arns
  build_compute_type      = var.build_compute_type
  build_docker_image      = var.build_docker_image
  build_docker_tag        = var.build_docker_tag
  buildspec               = var.buildspec
  require_approval        = var.github_branch_name == "production" ? "true" : "false"
  github_connection_arn   = var.github_connection_arn
  github_repository_owner = var.github_repository_owner
  github_repository_name  = var.github_repository_name
  github_branch_name      = var.github_branch_name
  cache_bucket            = var.cache_bucket
}

module "web_app" {
  source = "./modules/web-app"

  dns_name           = var.dns_name
  cloudflare_zone_id = var.cloudflare_zone_id
  acm_arn            = var.acm_arn
}
