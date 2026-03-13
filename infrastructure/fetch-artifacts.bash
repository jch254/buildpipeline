#!/bin/bash -ex

echo Fetching artifacts via AWS CLI...

# Fetch from the test artifacts bucket since that's where the build artifacts are stored.
# Allow override for future cross-account or non-standard promotion flows.
if [[ -z "${TEST_ARTIFACT_BUCKET:-}" ]]; then
	ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
	TEST_ARTIFACT_BUCKET="buildpipeline-test-artifacts-${ACCOUNT_ID}"
fi

TEST_ARTIFACT_KEY="${TEST_ARTIFACT_KEY:-latest.zip}"

# Use the latest.zip artifact which is uploaded by the test environment
aws s3 cp "s3://${TEST_ARTIFACT_BUCKET}/${TEST_ARTIFACT_KEY}" latest.zip
unzip -oq latest.zip

echo Finished fetching artifacts
