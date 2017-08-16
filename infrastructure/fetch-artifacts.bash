#!/bin/bash -ex

echo Fetching artifacts via AWS CLI...

aws s3 cp s3://$ARTIFACT_ARCHIVE_BUCKET/$CODEBUILD_RESOLVED_SOURCE_VERSION.zip $CODEBUILD_RESOLVED_SOURCE_VERSION.zip
unzip $CODEBUILD_RESOLVED_SOURCE_VERSION.zip

echo Finished fetching artifacts
