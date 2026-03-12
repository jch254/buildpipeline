# Web-app

## Requirements

- Terraform: `>= 1.0`

## Inputs

- `acm_arn`: ARN of the ACM SSL certificate for the CloudFront alias.
- `cloudflare_zone_id`: Cloudflare Zone ID for the apex domain.
- `dns_name`: Public DNS name for the app.

## Outputs

- `cloudfront_distribution_id`: CloudFront distribution ID.
- `s3_bucket_id`: Backing S3 bucket ID.
