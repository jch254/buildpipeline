terraform {
  backend "s3" {
    encrypt= "true"
  }
}

provider "aws" {
  region = "${var.region}"
  version = "~> 0.1"
}

module "build_pipeline" {
  source = "./modules/build-pipeline"

  name = "${var.name}"
  kms_key_arns = "${var.kms_key_arns}"
  ssm_parameter_arns = "${var.ssm_parameter_arns}"
  build_docker_image = "${var.build_docker_image}"
  build_docker_tag = "${var.build_docker_tag}"
  buildspec = "${var.buildspec}"
  require_approval = "${var.github_branch_name == "production" ? "true" : "false"}"
  approval_sns_topic_arn = "${var.approval_sns_topic_arn}"
  github_oauth_token = "${var.github_oauth_token}"
  github_repository_owner = "${var.github_repository_owner}"
  github_repository_name = "${var.github_repository_name}"
  github_branch_name = "${var.github_branch_name}"
}

module "web_app" {
  source = "./modules/web-app"

  dns_name = "${var.dns_name}"
  route53_zone_id = "${var.route53_zone_id}"
  acm_arn = "${var.acm_arn}"
}