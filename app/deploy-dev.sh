#!/bin/bash

# npm run build
rm -rf ../.aws-sam/*
rm ../layer/nodejs.zip
cd ../layer
zip ./nodejs.zip -r ./nodejs/*
cd ../app
npm run build
sam package --output-template-file packaged.yaml --s3-bucket sam-base
aws cloudformation deploy --s3-bucket sam-base --region eu-west-1 --template-file packaged.yaml --stack-name sam-base --capabilities CAPABILITY_IAM --capabilities CAPABILITY_NAMED_IAM
