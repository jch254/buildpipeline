resource "aws_s3_bucket" "apex_bucket" {
  bucket        = var.dns_name
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "apex_bucket" {
  bucket = aws_s3_bucket.apex_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "apex_bucket" {
  bucket = aws_s3_bucket.apex_bucket.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_cloudfront_origin_access_control" "apex_bucket" {
  name                              = "${var.dns_name}-oac"
  description                       = "Origin access control for ${var.dns_name}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name              = aws_s3_bucket.apex_bucket.bucket_regional_domain_name
    origin_id                = "apex_bucket_origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.apex_bucket.id

    s3_origin_config {
      origin_access_identity = ""
    }
  }

  enabled             = true
  aliases             = [var.dns_name]
  default_root_object = "index.html"

  custom_error_response {
    error_code         = "403"
    response_code      = "200"
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = "404"
    response_code      = "200"
    response_page_path = "/index.html"
  }

  price_class = "PriceClass_All"

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "apex_bucket_origin"

    forwarded_values {
      query_string = true
      headers      = ["*"]

      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  viewer_certificate {
    acm_certificate_arn      = var.acm_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

data "aws_iam_policy_document" "apex_bucket" {
  statement {
    sid    = "AllowCloudFrontReadAccess"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = ["s3:GetObject"]
    resources = [
      "${aws_s3_bucket.apex_bucket.arn}/*"
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.cdn.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "apex_bucket" {
  bucket = aws_s3_bucket.apex_bucket.id
  policy = data.aws_iam_policy_document.apex_bucket.json
}

resource "cloudflare_dns_record" "app" {
  zone_id = var.cloudflare_zone_id
  name    = var.dns_name
  type    = "CNAME"
  ttl     = 1
  content = aws_cloudfront_distribution.cdn.domain_name
  proxied = false
  comment = "Managed by Terraform for ${var.dns_name}"
}
