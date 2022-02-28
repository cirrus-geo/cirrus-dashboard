#!/bin/bash

set -o pipefail

if [[ "$#" -lt 1 ]]; then
    echo "Requires environment name as a parameter"
    exit 1
fi

ENVIRONMENT=$1
ENVIRONMENT_CONFIG_PATH="../.env.production"
SECRET_ENV="${ENVIRONMENT}"

shift
ARGS=$@

rm -f "${ENVIRONMENT_CONFIG_PATH}"
echo "Setting up .env.production configuration"

CIRRUS_API_ENDPOINT=$(aws cloudformation $ARGS describe-stacks --stack-name cirrus-$ENVIRONMENT| jq -c -r '.Stacks[0].Outputs[] | select(.OutputKey | test("^ServiceEndpoint$")) | .OutputValue')

if [[ "$CIRRUS_API_ENDPOINT" == "" ]]; then
    echo "Unable to determine CIRRUS_API_ENDPOINT"
    exit 1
fi

echo "Using CIRRUS_API_ENDPOINT=${CIRRUS_API_ENDPOINT}"
echo "Building .env.production at ${ENVIRONMENT_CONFIG_PATH}"
echo CIRRUS_API_ENDPOINT=${CIRRUS_API_ENDPOINT} >> "${ENVIRONMENT_CONFIG_PATH}"
cat "${ENVIRONMENT_CONFIG_PATH}"
