# Cirrus Dashboard

Dashboard for Cirrus processing pipeline.

## Getting Started

### Requirements
* node
* yarn*
* Environment files

*If you don't have yarn installed, you should be okay running the project with npm, but keep in mind the dependencies should be updated using yarn.

#### Environment Files
For local development, you should include an `.env.development` file with the proper configuration.

For production builds, you should include an `.env.production` file with the proper configuration.

```
CIRRUS_API_ENDPOINT="[Endpoint]"
```

### Installing Depdencies
```
yarn install
```

### Development
```
yarn develop
```

### Production Builds
```
yarn build
```

### Deploying cirrus-dashboard into AWS
```
export ENVIRONMENT=Development
export AWS_REGION=us-east-1
export AWS_DEFAULT_REGION=us-east-1
TARGET_ENVIRONMENT=$(echo $ENVIRONMENT | tr '[:upper:]' '[:lower:]')
TARGET_BUCKET="cirrus-dashboard-${TARGET_ENVIRONMENT}"
S3_BUCKET="http://${target_bucket}.s3-website-${AWS_REGION}.amazonaws.com"

rm -rf public
cd build-deploy && sh ./build-environment.sh $ENVIRONMENT && \
  source ./.env.production && npm run build && \
  sh ./create-bucket.sh "${TARGET_ENVIRONMENT}" && \
  echo "Syncing deployment to S3 ..." && \
  aws s3 rm s3://${TARGET_BUCKET} --recursive && \
  aws s3 cp ./public s3://${TARGET_BUCKET}/ --recursive && \
  echo "Updating metadata ..." && \
  sh ./update-metadata.sh "${TARGET_ENVIRONMENT}" && \
  echo "Done"
```
