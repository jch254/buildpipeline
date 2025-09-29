resource "aws_cloudwatch_log_group" "codebuild_lg" {
  name              = "/aws/codebuild/${var.name}"
  retention_in_days = var.log_retention
}

resource "aws_iam_role" "codebuild_role" {
  name = "${var.name}-codebuild"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codebuild.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

data "template_file" "codebuild_policy" {
  template = "${file("${path.module}/codebuild-role-policy.tpl")}"

  vars = {
    kms_key_arns       = var.kms_key_arns
    ssm_parameter_arns = var.ssm_parameter_arns
  }
}

resource "aws_iam_role_policy" "codebuild_policy" {
  name   = "${var.name}-codebuild-policy"
  role   = aws_iam_role.codebuild_role.id
  policy = data.template_file.codebuild_policy.rendered
}

resource "aws_codebuild_project" "codebuild_project" {
  count        = var.vpc_id == "" ? 1 : 0
  name         = var.name
  description  = "Builds, tests and deploys ${var.name}"
  service_role = aws_iam_role.codebuild_role.arn

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = var.build_compute_type
    image                       = "${var.build_docker_image}:${var.build_docker_tag}"
    type                        = "LINUX_CONTAINER"
    privileged_mode             = var.privileged_mode
    image_pull_credentials_type = var.image_pull_credentials_type
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = var.buildspec
  }

  cache {
    type     = var.cache_bucket == "" ? "NO_CACHE" : "S3"
    location = var.cache_bucket
  }
}


resource "aws_codebuild_project" "codebuild_project_in_vpc" {
  count        = var.vpc_id != "" ? 1 : 0
  name         = var.name
  description  = "Builds, tests and deploys ${var.name}"
  service_role = aws_iam_role.codebuild_role.arn

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = var.build_compute_type
    image                       = "${var.build_docker_image}:${var.build_docker_tag}"
    type                        = "LINUX_CONTAINER"
    privileged_mode             = var.privileged_mode
    image_pull_credentials_type = var.image_pull_credentials_type
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = var.buildspec
  }

  cache {
    type     = var.cache_bucket == "" ? "NO_CACHE" : "S3"
    location = var.cache_bucket
  }

  vpc_config {
    vpc_id             = var.vpc_id
    subnets            = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_iam_role" "codepipeline_role" {
  name = "${var.name}-codepipeline"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codepipeline.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

data "template_file" "codepipeline_policy" {
  template = "${file("${path.module}/codepipeline-role-policy.tpl")}"
}

resource "aws_iam_role_policy" "codepipeline_policy" {
  name   = "${var.name}-codepipeline-policy"
  role   = aws_iam_role.codepipeline_role.id
  policy = data.template_file.codepipeline_policy.rendered
}

resource "aws_s3_bucket" "artifacts" {
  bucket        = "${var.name}-artifacts"
  acl           = "private"
  force_destroy = true
}

resource "aws_codepipeline" "codepipeline" {
  count    = var.require_approval == "false" ? 1 : 0
  name     = var.name
  role_arn = aws_iam_role.codepipeline_role.arn

  artifact_store {
    location = aws_s3_bucket.artifacts.bucket
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "pull-source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["source"]

      configuration = {
        ConnectionArn    = var.github_connection_arn
        FullRepositoryId = "${var.github_repository_owner}/${var.github_repository_name}"
        BranchName       = var.github_branch_name
      }
    }
  }

  stage {
    name = "CodeBuild"

    action {
      name            = "execute-codebuild"
      category        = "Build"
      owner           = "AWS"
      provider        = "CodeBuild"
      input_artifacts = ["source"]
      version         = "1"

      configuration = {
        ProjectName = var.vpc_id != "" ? aws_codebuild_project.codebuild_project_in_vpc[0].name : aws_codebuild_project.codebuild_project[0].name
      }
    }
  }
}

resource "aws_codepipeline" "codepipeline_with_approval" {
  count    = var.require_approval == "true" ? 1 : 0
  name     = var.name
  role_arn = aws_iam_role.codepipeline_role.arn

  artifact_store {
    location = aws_s3_bucket.artifacts.bucket
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "pull-source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["source"]

      configuration = {
        ConnectionArn    = var.github_connection_arn
        FullRepositoryId = "${var.github_repository_owner}/${var.github_repository_name}"
        BranchName       = var.github_branch_name
      }
    }
  }

  stage {
    name = "Approval"

    action {
      name     = "manual-approval"
      category = "Approval"
      owner    = "AWS"
      provider = "Manual"
      version  = "1"

      configuration = {
        NotificationArn = var.approval_sns_topic_arn
        CustomData      = var.approval_comment
      }
    }
  }

  stage {
    name = "CodeBuild"

    action {
      name            = "execute-codebuild"
      category        = "Build"
      owner           = "AWS"
      provider        = "CodeBuild"
      input_artifacts = ["source"]
      version         = "1"

      configuration = {
        ProjectName = var.vpc_id != "" ? aws_codebuild_project.codebuild_project_in_vpc[0].name : aws_codebuild_project.codebuild_project[0].name
      }
    }
  }
}
