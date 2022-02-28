#!/bin/bash
#
# Example usage:
#  ./update-metadata.sh Development --profile my-dev --region $AWS_REGION
#

set -o pipefail

if [ "$#" -lt 1 ]; then
  echo "Requires environment name as a parameter"
  exit 1
fi

ENVIRONMENT=$1
shift

ARGS=$@

BUCKET="cirrus-dashboard-${ENVIRONMENT}"
echo "Checking to see if ${BUCKET} exists"

aws s3api head-bucket --bucket "$BUCKET" $ARGS
if [ $? -eq 0 ]; then
  echo "Bucket exists"
else
  echo "Bucket does not exist"
  break
fi

# Caching policy recommendations per https://www.gatsbyjs.org/docs/caching/

cacheControlNever="public, max-age=0, must-revalidate"
cacheControlForever="public, max-age=31536000, immutable"

# page-data.json files require the content-type to function appropriately
# due to a bug / restriction in Gatsby's page lookup engine
aws s3 cp "s3://${BUCKET}/page-data" "s3://${BUCKET}/page-data"  \
  --recursive \
  --content-type "application/json" \
  --metadata-directive REPLACE --exclude "*" --include "*.json" $ARGS
if [ $? -eq 0 ]; then
  echo "Updated page-data JSON files to content type application/json"
else
  echo "Failed to update page-data JSON files to content type application/json"
fi

# Page data controls Gatby's lookups and page management, it should
# not get cached ever
aws s3 cp "s3://${BUCKET}/page-data" "s3://${BUCKET}/page-data"  \
  --recursive \
  --cache-control "${cacheControlNever}" \
  --metadata-directive REPLACE $ARGS
if [ $? -eq 0 ]; then
  echo "Updated page-data directory metadata"
else
  echo "Failed to update page-data directory metadata"
fi

# Update all and any files in the static directory to cache forever
aws s3 cp "s3://${BUCKET}/static" "s3://${BUCKET}/static"  \
  --recursive \
  --cache-control "${cacheControlForever}" \
  --metadata-directive REPLACE $ARGS
if [ $? -eq 0 ]; then
  echo "Updated static directory metadata"
else
  echo "Failed to update static directory metadata"
fi

# Update all CSS and JS files to cache forever
# We specifically exclude sw.js, which is used in some
# Gatsby functionality for service workers
aws s3 cp "s3://${BUCKET}/" "s3://${BUCKET}/" \
  --recursive \
  --cache-control "${cacheControlForever}" \
  --metadata-directive REPLACE  \
  --exclude "*" --include "*.css" --include "*.js" --exclude "sw.js" $ARGS
if [ $? -eq 0 ]; then
  echo "Updated all CSS and JS file metadata"
else
  echo "Failed to update all CSS and JS file metadata"
fi
