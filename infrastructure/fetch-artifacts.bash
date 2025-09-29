#!/bin/bash -ex

echo Fetching artifacts via AWS CLI...

# Fetch from test artifacts bucket since that's where the build artifacts are stored
TEST_ARTIFACT_BUCKET="buildpipeline-test-artifacts"

# Use the latest.zip artifact which is uploaded by the test environment
aws s3 cp s3://"$TEST_ARTIFACT_BUCKET"/latest.zip latest.zip
unzip -q latest.zip

echo Finished fetching artifacts
