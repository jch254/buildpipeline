# Web-app

## Requirements

| Name      | Version |
| --------- | ------- |
| terraform | >= 0.12 |

## Inputs

| Name            | Description                |  Type  | Default | Required |
| --------------- | -------------------------- | :----: | :-----: | :------: |
| acm_arn         | ARN of ACM SSL certificate | string |   n/a   |   yes    |
| dns_name        | DNS name for app           | string |   n/a   |   yes    |
| route53_zone_id | Route 53 Hosted Zone ID    | string |   n/a   |   yes    |

## Outputs

| Name                       | Description |
| -------------------------- | ----------- |
| cloudfront_distribution_id | n/a         |
| s3_bucket_id               | n/a         |
