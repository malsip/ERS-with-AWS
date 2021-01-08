import * as AWS from 'aws-sdk';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { SessionService } from './session.service';
import { User } from './models/user';

export let AWS_Data = {
    AWS: AWS,
    
    AmazonCognitoIdentity: AmazonCognitoIdentity,

    poolData: {
        UserPoolId: 'us-east-1_95KwfJG0G',
        ClientId: '3c7b4fh1ups1voeqihhlct4rqo'
    },
    
    IdentityPoolId: 'us-east-1:628c3742-aa02-4532-8f89-d010de29fa46',
    
    cognitoDatasetName: "project-1-users",

    cognitoUser: null,


    bucketName: 'project1-frontend-malsip'
}

AWS_Data.AWS.config.region = 'us-east-1';
let sessionService = new SessionService();

if(sessionService.getCognitoIdToken()){
  let idToken = sessionService.getCognitoIdToken();

  let userPool = new AWS_Data.AmazonCognitoIdentity.CognitoUserPool(AWS_Data.poolData);
  let userData = {
    Username: sessionService.getUserSession().username,
    Pool: userPool
  }
  AWS_Data.cognitoUser = new AWS_Data.AmazonCognitoIdentity.CognitoUser(userData);

  AWS_Data.AWS.config.credentials = new AWS_Data.AWS.CognitoIdentityCredentials({
    IdentityPoolId: AWS_Data.IdentityPoolId,
    Logins: {
      'cognito-idp.us-east-1.amazonaws.com/us-east-1_95KwfJG0G' : idToken.jwtToken
    }
  });
  (<AWS.CognitoIdentityCredentials>AWS_Data.AWS.config.credentials).refresh((error)=>{
    if (error) {
      console.error(error);
      alert('Unable to sign in. Please try again.')
    } else {
      console.log('Successfully logged!');
      }
  });


  //console.log("identityId: ", (<AWS.CognitoIdentityCredentials>AWS_Data.AWS.config.credentials).identityId)
}






