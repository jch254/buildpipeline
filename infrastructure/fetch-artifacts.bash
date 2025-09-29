#!/bin/bash -ex

echo Fetching artifacts via AWS CLI...

ARTIFACT_ARCHIVE_BUCKET=$(cd infrastructure && terraform output -raw artifacts_bucket_id)

aws s3 cp s3://"$ARTIFACT_ARCHIVE_BUCKET/$CODEBUILD_RESOLVED_SOURCE_VERSION".zip "$CODEBUILD_RESOLVED_SOURCE_VERSION".zip
unzip -q "$CODEBUILD_RESOLVED_SOURCE_VERSION".zip

echo Finished fetching artifacts
