# Deployment/Infrastructure

BuildPipeline is built, tested and deployed to AWS by CodePipeline and CodeBuild. Artifacts are served from S3. CloudFront is used as a CDN. DNS for project subdomains is managed in Cloudflare.

To deploy to AWS, you must:

1. Install [Terraform](https://www.terraform.io/) and make sure it is in your PATH.
1. Set your AWS credentials using one of the following options:
   1. Set your credentials as the environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.
   1. Run `aws configure` and fill in the details it asks for.
   1. Run on an EC2 instance with an IAM Role.
   1. Run via CodeBuild or ECS Task with an IAM Role (see [buildspec-test.yml](../buildspec-test.yml) for workaround)

--

## Manually created components

The following infrastructure components should be created manually and passed to Terraform via the appropriate variables in the appropriate buildspec declaration:

- Cloudflare zone for the apex domain, with the zone ID exposed to project repos
- Cloudflare API token with DNS edit access for the apex domain, exposed to project repos as CLOUDFLARE_API_TOKEN
- ACM Certificate in US East (N. Virginia) region for CloudFront
- one buildpipeline KMS key for SecureString parameters used by this repo
- buildpipeline SSM Parameter Store entries for GitHub connection ARN, Cloudflare values, GA IDs, and environment-specific app secrets

Production approval SNS topics are created by this Terraform stack. If you want email or other subscriptions, add those manually after the topic exists.

## Initial deploy

There is a chicken and egg situation - CodeBuild and CodePipeline will eventually build, test and deploy the project but this can only happen after the CodeBuild and CodePipeline projects have been created. Terraform needs to be run initially to create the CodeBuild and CodePipeline projects in each account/environment. CodeBuild and CodePipeline will then build, test and deploy every commit on the specified branch of the GitHub repo.

**All commands below must be run from the root directory.**

1. Ensure your local AWS credentials can access the target account and SSM parameters.
1. Run `./infrastructure/bootstrap-deploy.bash test` for the test environment, or `./infrastructure/bootstrap-deploy.bash prod` for production.

The bootstrap script reads the selected buildspec, exports `env.variables`, resolves `env.parameter-store` entries via AWS SSM with decryption, and runs the initial Terraform apply locally. After that first apply, CodeBuild and CodePipeline can own subsequent deploys.

If you want the manual path instead, exporting the environment variables specified in a buildspec declaration is tedious and time-consuming. The bash script below utilises a YAML parser called [shyaml](https://github.com/0k/shyaml) and automates the process (shyaml must be installed before using). Environment variables specified in buildspec phases or bash scripts will still need to be exported manually.

```sh
export $(
  cat BUILDSPEC_FILE_PATH \
    | shyaml get-values-0 env.variables \
    | while IFS='' read -r -d '' key && IFS='' read -r -d '' value; do
      echo $key=$value
    done
)
```

**All commands below must be run in the /infrastructure directory.**

## Manually deploying infrastructure

1. Update and export all environment variables specified in the appropriate buildspec declaration, including values referenced from Parameter Store
1. Initialise Terraform:

```terraform
terraform init \
  -backend-config 'bucket=YOUR_S3_BUCKET' \
  -backend-config 'key=YOUR_S3_KEY' \
  -backend-config 'region=YOUR_REGION' \
  -get=true \
  -upgrade=true
```

1. `terraform plan -out main.tfplan`
1. `terraform apply main.tfplan`

## Manually updating infrastructure

1. Update and export all environment variables specified in the appropriate buildspec declaration (check all phases) and bash scripts
1. Make necessary infrastructure code changes.
1. Initialise Terraform:

```terraform
terraform init \
  -backend-config 'bucket=YOUR_S3_BUCKET' \
  -backend-config 'key=YOUR_S3_KEY' \
  -backend-config 'region=YOUR_REGION' \
  -get=true \
  -upgrade=true
```

1. `terraform plan -out main.tfplan`
1. `terraform apply main.tfplan`

## Manually destroying infrastructure (use with care)

1. Update and export all environment variables specified in the appropriate buildspec declaration (check all phases) and bash scripts
1. Initialise Terraform:

```terraform
terraform init \
  -backend-config 'bucket=YOUR_S3_BUCKET' \
  -backend-config 'key=YOUR_S3_KEY' \
  -backend-config 'region=YOUR_REGION' \
  -get=true \
  -upgrade=true
```

1. `terraform destroy`
