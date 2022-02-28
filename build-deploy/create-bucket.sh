#!/bin/bash

set -o pipefail

if [[ "$#" -lt 1 ]]; then
    echo "Requires environment name as a parameter"
    exit 1
fi

ENVIRONMENT=$1
shift

ARGS=$@

BUCKET="cirrus-dashboard-${ENVIRONMENT}"
BUCKET_ARN="arn:aws:s3:::$BUCKET/*"
echo "Checking to see if ${BUCKET} exists"

aws s3api head-bucket --bucket "$BUCKET"
if [[ $? -eq 0 ]]; then
  echo "Bucket exists"
else
  echo "Bucket does not exist"
  echo "Creating ${BUCKET}"
  echo "$(aws s3 mb s3://"$BUCKET" --region ${AWS_REGION})"
  echo "$(aws s3 website s3://"$BUCKET" --index-document index.html --error-document index.html)"
fi

# ensure default encryption-at-rest is enabled
echo "S3 Bucket: $BUCKET - ApplyServerSideEncryptionByDefault ..."
aws s3api put-bucket-encryption --bucket $BUCKET --server-side-encryption-configuration \
    '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}'

# If you ever want to put cloudfront in front of the s3 bucket you can set a 
# s3 bucket policy to restrict access by using this version of RESTRICT_CF
#RESTRICT_CF=', "Condition": { "StringLike": { "aws:UserAgent": "*Amazon CloudFront*" }}'
RESTRICT_CF=''

echo "Checking to see if ${BUCKET} has a policy"
aws s3api get-bucket-policy-status --bucket "$BUCKET"
if [[ $? -eq 0 ]]; then
  echo "Bucket has a policy"
else
  echo "Bucket policy not found, adding bucket policy"
  touch policy.json
  echo '{"Version": "2012-10-17","Statement": [{"Sid": "PublicReadGetObject","Effect": "Allow","Principal": "*","Action": "s3:GetObject","Resource": "'"${BUCKET_ARN}"'"'"$RESTRICT_CF"'}]}' > policy.json
  cat policy.json
  echo "$(aws s3api put-bucket-policy --bucket "$BUCKET" --policy file://policy.json)"
fi

aws s3api get-bucket-website --bucket "$BUCKET" |jq -e '.ErrorDocument.Key'
if [[ $? -eq 0 ]]; then
  echo "Bucket has error page"
else
  echo "Updating bucket website"
  echo "$(aws s3 website s3://"$BUCKET" --index-document index.html --error-document index.html)"
fi
