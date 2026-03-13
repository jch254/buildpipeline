terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "= 4.67.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "= 5.18.0"
    }
    template = {
      source  = "hashicorp/template"
      version = "= 2.2.0"
    }
  }

  backend "s3" {
    encrypt = "true"
  }
}
