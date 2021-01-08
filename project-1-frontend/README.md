# Project1Frontend

This project was Designed to mimic the Revature Project 1 ERS system using Angular for frontend and AWS as Backend.  This README will provide details on configuring the backend.

## Setting up AWS-SDK

Unfortuately this took more effort than it should have.  There are a few manual configurations that need to be done in order for AWS-SDK to work.
- npm install aws-sdk
- npm install amazon-cognito-identity-js
- add "node" to types array in tsconfig.app.json (I also added this to tsconfig.app, along with enabling esModuleInterop there, but I'm unsure if it is necessary)
- enable global use by adding this script to your index.html
```

<script>
    var global = global || window;
    var Buffer = Buffer || [];
    var process = process || {
      env: { DEBUG: undefined },
      version: []
    };
  </script>

```
That should do it.

## Cognito

Cognito is the source of Users in this project, and a proper Cognito User Pool will be required to hook up properly.  
- You will need the Attributes given_name, family_name, email, and custom attribute subscribed (this is hooked up but not used for anything right now)
- Allow Users to sign themselves up
- Disable most everything else as it wont be necessary.
- Add an App Client. Make sure to enable SRP and under attribute read and write permissions enable the custom attribute
- Set App client settings to enable use of User Pool, and add an arbitrary domain name for the app client

You will also need a Federated Identity Pool using your user pool information.
- You will need to add an authentication provider using your user pool and app client
- For authorization, the identity pool will auto generate roles for you. These roles are provided to every user in the user pool when logged in. The auth role needs permissions for Cognito User Pools, Cognito Identity, S3, and SES. If you are getting permissions error provide permissions here.

## S3 Hosting

Not only is my S3 used to host the Angular frontend, it also uses a bucket to host images for the receipts.  This requires permissions to be enabled for the bucket.  I have a Bucket Policy that allows anyone to get objects, and a CORS policy that allows all origins and methods.

## DynamoDB

The DynamoDB table I setup is intended only to host the reimbursements information.  It relies on a key based on the Author and the Time_Submitted (sort key), which will always be unique.  Not Much configuration needed. 

## Lambda

Most Lambda information will be available in my Lambda repository, however an important note is to allow Lambda role permissions to access your dynamodb table.  Another important note is if you are receiving a CORS error saying you have no CORS headers add CORS headers to the return statement under status.

## API Gateway

API Gateway requires some annoying configuration to prevent errors from occuring. 
- Under Gateway Responses -> Default 4xx -> Response Headers add Access-Control-Allow-Origin with value "*".
- Under Authorizers add an authorizer that uses your cognito user pool, with a Token Source named Authorization
- For every Resource Method Enable CORS, in Method Request have it pull from the Authorizer, and in Integration Response/Method Response make sure to add Access-Control-Allow-Origin with value "*" (in Method response no value can be added, but a value can be added in integration response. If neglected you will return a CORS error that implies you have no CORS header).
- If you ever use path variables or path queries enable proxy integration in the integration request.  Your path information will now show up in the event in lambda (or whatever you plan to use).

## Frontend Configuration

All AWS configuration is done in AWS-Data.ts.  You will only need to replace information that is hard coded for a proper setup.

Note: I import the AWS sdk only in AWS-Data, which was easy for me, but not necessary.

## Code Pipeline

My Repository for this code is hooked up to Code Commit, Code Build and Code Pipeline. A buildspec.yml is available to see if your interested.  The buildspec auto-deploys to my S3, but will require permissions in order to do so.
