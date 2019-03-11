# Web-app

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|:----:|:-----:|:-----:|
| acm\_arn | ARN of ACM SSL certificate | string | n/a | yes |
| dns\_name | DNS name for app | string | n/a | yes |
| route53\_zone\_id | Route 53 Hosted Zone ID | string | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| cloudfront\_distribution\_id |  |
| s3\_bucket\_id |  |