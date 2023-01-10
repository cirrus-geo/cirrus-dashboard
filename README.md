# FilmDrop Dashboard

FilmDrop Dashboard for displaying metrics and workflows found in the Cirrus processing pipeline.

- [Gatsby](https://www.gatsbyjs.org/) for templating and static site generation.
- Gatsby relies on [React](https://reactjs.org/) as the UI framework
- The compiled website is uploaded to s3 ad which point it is served

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
METRICS_API_ENDPOINT="[Endpoint]"
```

### Installing Dependencies
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

## Deployment

### Links
* Live dev link: https://dashboard.dev.demo.filmdrop.io
* Live prod link: https://dashboard.demo.filmdrop.io

Deployment is handled by gitlab ci scripts: `.gitlab-ci.yml`\

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

## Authors

Initial Cirrus Dashboard: https://github.com/cirrus-geo/cirrus-dashboard\
Primary MVP Dev: Lucy Hutcheson @ Element84\
Project Structure & DevOps: Hector Machin @ Element84

