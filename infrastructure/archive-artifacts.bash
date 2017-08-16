#!/bin/bash -ex

echo Archiving artifacts via AWS CLI...

ARTIFACT_ARCHIVE_BUCKET=$(cd infrastructure && terraform output artifacts_bucket_id)

zip -r -X $CODEBUILD_RESOLVED_SOURCE_VERSION.zip dist
aws s3 cp $CODEBUILD_RESOLVED_SOURCE_VERSION.zip s3://$ARTIFACT_ARCHIVE_BUCKET/$TF_VAR_name/$CODEBUILD_RESOLVED_SOURCE_VERSION.zip

echo Finished archiving artifacts
