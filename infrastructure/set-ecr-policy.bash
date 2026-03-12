#!/bin/bash
set -euo pipefail

# Script to set ECR repository policies so CodeBuild can pull environment images.

REGION="ap-southeast-2"
ACCOUNT_ID="352311918919"

usage() {
  echo "Usage: $0 [docker-node-terraform-aws|dind-terraform-aws|all]" >&2
  exit 1
}

build_policy_file() {
  local policy_file="$1"

  cat > "$policy_file" << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCodeBuildProjects",
      "Effect": "Allow",
      "Principal": {
        "Service": "codebuild.amazonaws.com"
      },
      "Action": [
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:BatchCheckLayerAvailability"
      ],
      "Condition": {
        "StringEquals": {
          "aws:SourceAccount": "${ACCOUNT_ID}"
        },
        "ArnLike": {
          "aws:SourceArn": [
            "arn:aws:codebuild:${REGION}:${ACCOUNT_ID}:project/buildpipeline-test",
            "arn:aws:codebuild:${REGION}:${ACCOUNT_ID}:project/buildpipeline-prod"
          ]
        }
      }
    }
  ]
}
EOF
}

set_policy() {
  local repository_name="$1"
  local policy_file

  policy_file=$(mktemp)
  build_policy_file "$policy_file"

  echo "Setting ECR repository policy for ${repository_name}..."
  aws ecr set-repository-policy \
    --repository-name "${repository_name}" \
    --region "${REGION}" \
    --policy-text "file://${policy_file}"

  rm -f "$policy_file"
}

case "${1:-all}" in
  docker-node-terraform-aws)
    set_policy "docker-node-terraform-aws"
    ;;
  dind-terraform-aws)
    set_policy "dind-terraform-aws"
    ;;
  all)
    set_policy "docker-node-terraform-aws"
    set_policy "dind-terraform-aws"
    ;;
  *)
    usage
    ;;
esac

echo "ECR repository policy update complete."