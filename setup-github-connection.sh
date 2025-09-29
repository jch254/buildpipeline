#!/bin/bash

echo "GitHub Connection Setup Helper"
echo "=============================="
echo

# Check if connection ARN parameter exists
echo "1. Checking for GitHub connection ARN parameter..."
CONNECTION_ARN=$(aws ssm get-parameter --name "/shared/github-connection-arn" --region ap-southeast-2 --query 'Parameter.Value' --output text 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ Found GitHub connection ARN: $CONNECTION_ARN"
else
    echo "❌ GitHub connection ARN not found in Parameter Store"
    echo "   Please create it first with:"
    echo "   aws ssm put-parameter --region ap-southeast-2 --name \"/shared/github-connection-arn\" --value \"YOUR-ARN\" --type String"
    echo
    exit 1
fi

# Verify the connection exists
echo
echo "2. Verifying connection exists in AWS..."
CONNECTION_ID=$(echo $CONNECTION_ARN | cut -d'/' -f2)
aws codestar-connections get-connection --connection-arn "$CONNECTION_ARN" --region ap-southeast-2 >/dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Connection exists and is accessible"
else
    echo "❌ Connection not found or not accessible"
    echo "   Please check the ARN and your permissions"
    exit 1
fi

# Check connection status
echo
echo "3. Checking connection status..."
STATUS=$(aws codestar-connections get-connection --connection-arn "$CONNECTION_ARN" --region ap-southeast-2 --query 'Connection.ConnectionStatus' --output text)
echo "   Status: $STATUS"

if [ "$STATUS" = "AVAILABLE" ]; then
    echo "✅ Connection is ready to use"
elif [ "$STATUS" = "PENDING" ]; then
    echo "⚠️  Connection is pending - complete the GitHub authorization"
else
    echo "❌ Connection status: $STATUS"
fi

# Set environment variables for infrastructure deployment
echo
echo "4. Setting up environment variables for deployment..."
export REMOTE_STATE_BUCKET="603-terraform-remote-state"
export TF_VAR_name="buildpipeline-test"
export TF_VAR_region="ap-southeast-2"
export TF_VAR_github_connection_arn="$CONNECTION_ARN"

echo "✅ Environment variables set:"
echo "   REMOTE_STATE_BUCKET=$REMOTE_STATE_BUCKET"
echo "   TF_VAR_name=$TF_VAR_name"
echo "   TF_VAR_region=$TF_VAR_region"
echo "   TF_VAR_github_connection_arn=$TF_VAR_github_connection_arn"

echo
echo "5. Ready to deploy infrastructure!"
echo "   Run: ./infrastructure/deploy-infrastructure.bash"
echo
