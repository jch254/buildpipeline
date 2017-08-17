#!/bin/bash -ex

echo Uploading artifacts via AWS CLI...

S3_BUCKET_ID=$(cd infrastructure && terraform output s3_bucket_id)
CLOUDFRONT_DISTRIBUTION_ID=$(cd infrastructure && terraform output cloudfront_distribution_id)

cd dist
echo "window.env = { DEPLOY_ENV: \"$DEPLOY_ENV\", APP_VERSION: \"$APP_VERSION\", APP_SECRET: \"$APP_SECRET\" }" > assets/env.js
aws s3 sync . "s3://${S3_BUCKET_ID}/" --delete --acl=public-read --exclude '.git/*'
aws cloudfront create-invalidation --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" --paths '/*'
cd ..

echo Finished uploading artifacts
