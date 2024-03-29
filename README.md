# FilmDrop Dashboard for Cirrus

FilmDrop Dashboard for displaying metrics and workflows found in the Cirrus processing pipeline.

- [Gatsby](https://www.gatsbyjs.org/) for templating and static site generation.
- Gatsby relies on [React](https://reactjs.org/) as the UI framework
- The compiled website is uploaded to s3 ad which point it is served

## Getting Started

### Requirements

- Node.js 18
- Yarn 1.x [installation](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
- Dotenv files

#### Dotenv Files

For local development, you should include an `.env.development` file with the proper configuration.

For production builds, you should include an `.env.production` file with the proper configuration.

```shell
CIRRUS_API_ENDPOINT="[Endpoint]"
METRICS_API_ENDPOINT="[Endpoint]"
```

### Installing Dependencies

```shell
yarn install
```

### Development

```shell
yarn develop
```

### Production Builds

```shell
yarn build
```

## Deployment

### Deploying cirrus-dashboard into AWS

```bash
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
