{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "codebuild:*",
        "s3:*",
        "codecommit:*",
        "sns:*",
        "codestar-connections:UseConnection",
        "codestar-connections:GetConnection"
      ],
      "Resource": "*"
    }
  ]
}