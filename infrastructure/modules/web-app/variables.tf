variable "dns_name" {
  description = "DNS name for app"
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for the apex domain"
}

variable "acm_arn" {
  description = "ARN of ACM SSL certificate"
}
