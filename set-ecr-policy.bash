#!/bin/bash

# Script to set ECR repository policy for CodeBuild access
# This allows CodeBuild to pull images from the ECR repository

REPOSITORY_NAME="buildpipeline-docker-node-terraform-aws"
REGION="ap-southeast-2"
ACCOUNT_ID="982898479788"

# Create ECR repository policy that allows CodeBuild to pull images
cat > ecr-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCodeBuildAccess",
      "Effect": "Allow",
      "Principal": {
        "Service": "codebuild.amazonaws.com"
      },
      "Action": [
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:BatchCheckLayerAvailability"
      ]
    },
    {
      "Sid": "AllowCodeBuildRole",
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "arn:aws:iam::${ACCOUNT_ID}:role/buildpipeline-test-codebuild",
          "arn:aws:iam::${ACCOUNT_ID}:role/buildpipeline-prod-codebuild"
        ]
      },
      "Action": [
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:BatchCheckLayerAvailability"
      ]
    }
  ]
}
EOF

echo "Setting ECR repository policy for ${REPOSITORY_NAME}..."
aws ecr set-repository-policy \
  --repository-name "${REPOSITORY_NAME}" \
  --region "${REGION}" \
  --policy-text file://ecr-policy.json

echo "ECR repository policy set successfully!"
rm ecr-policy.json