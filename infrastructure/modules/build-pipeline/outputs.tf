output "artifacts_bucket_id" {
  value = aws_s3_bucket.artifacts.id
}

output "codebuild_role_arn" {
  value = aws_iam_role.codebuild_role.arn
}

output "codebuild_role_unique_id" {
  value = aws_iam_role.codebuild_role.unique_id
}
