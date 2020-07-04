output "s3_bucket_id" {
  value = module.web_app.s3_bucket_id
}

output "cloudfront_distribution_id" {
  value = module.web_app.cloudfront_distribution_id
}

output "artifacts_bucket_id" {
  value = module.build_pipeline.artifacts_bucket_id
}
