#!/bin/bash

# npm run build
zip ./layer/nodejs.zip -r ./layer/nodejs
sam build
sam package --output-template-file packaged.yaml --s3-bucket sam-base
aws cloudformation deploy --s3-bucket sam-base --region eu-west-1 --template-file packaged.yaml --stack-name sam-base --capabilities CAPABILITY_IAM --capabilities CAPABILITY_NAMED_IAM
