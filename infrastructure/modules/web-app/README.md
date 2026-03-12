# Web-app

## Requirements

| Name      | Version |
| --------- | ------- |
| terraform | >= 1.0 |

## Inputs

| Name            | Description                |  Type  | Default | Required |
| --------------- | -------------------------- | :----: | :-----: | :------: |
| acm_arn         | ARN of ACM SSL certificate | string |   n/a   |   yes    |
| cloudflare_zone_id | Cloudflare Zone ID for the apex domain | string |   n/a   |   yes    |
| dns_name        | DNS name for app           | string |   n/a   |   yes    |

## Outputs

| Name                       | Description |
| -------------------------- | ----------- |
| cloudfront_distribution_id | n/a         |
| s3_bucket_id               | n/a         |
