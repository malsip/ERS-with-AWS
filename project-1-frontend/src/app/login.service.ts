import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './models/user';
import { Credentials } from './models/credentials';
import { SessionService } from './session.service';
import { AWS_Data } from './AWS-data';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private sessionService: SessionService) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
    withCredentials:true
  };

  cognitoSignUp(user: User){
    let params = {
      ClientId: AWS_Data.poolData.ClientId,
      Username: user.username,
      Password: user.password,
      ValidationData: [],
      UserAttributes: [
        {
          Name: "given_name",
          Value: user.firstName
        },
        {
          Name: "family_name",
          Value: user.lastName
        },
        {
          Name: "email",
          Value: user.email
        },
        {
          Name: 'custom:subscribed',
          Value: "false"
        }
      ]
    }

    let cisp = new AWS_Data.AWS.CognitoIdentityServiceProvider();
    cisp.signUp(params, (err, data) => {
      if (err) {
				console.log(err, err.stack); // an error occurred
				alert('Error: '+ JSON.stringify(err));
			}
		  else {
				console.log(JSON.stringify(data));           // successful response
				if (data.UserConfirmed) {
          alert('Sign up successful.');
				}
				else{
          alert('Please check your email for a verification link.');
				}
			}
    });
  }

  cognitoLogin(credentials: Credentials){
    console.log(credentials);

    let authDetails = new AWS_Data.AmazonCognitoIdentity.AuthenticationDetails({
      Username: credentials.username,
      Password: credentials.password
    });

    let userPool = new AWS_Data.AmazonCognitoIdentity.CognitoUserPool(AWS_Data.poolData);

    let userData = {
      Username: credentials.username,
      Pool: userPool
    }

    AWS_Data.cognitoUser = new AWS_Data.AmazonCognitoIdentity.CognitoUser(userData);

    AWS_Data.cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result)=>{
        this.onSuccess(result.getIdToken());
      },
      onFailure: (err)=>{
        if (err.message == '200'){ 
					AWS_Data.cognitoUser = userPool.getCurrentUser();
					if (AWS_Data.cognitoUser != null) {
						AWS_Data.cognitoUser.getSession((err, result) => {
			        if (err) {
                alert('Unable to sign in. Please try again.')
                console.error(err)
			        }
			        if (result) {
								this.onSuccess(result.getIdToken());
								console.log("Signed to CognitoID in successfully");
			        }
			    	});
					}
					else {
            console.log(err)
            alert('Unable to sign in. Please try again.')
					}
				}
				else {
          console.log(err)
          alert('Unable to sign in. Please try again.')
				}
      }
    });
  }

  onSuccess(idToken: any){
    console.log("success!");
    AWS_Data.AWS.config.credentials = new AWS_Data.AWS.CognitoIdentityCredentials({
      IdentityPoolId: AWS_Data.IdentityPoolId,
      Logins: {
        'cognito-idp.us-east-1.amazonaws.com/us-east-1_95KwfJG0G' : idToken.getJwtToken()
      }
    });
    this.sessionService.saveCognitoIdToken(idToken);
    this.sessionService.saveCognitoAccessToken(AWS_Data.cognitoUser.signInUserSession.accessToken.jwtToken);
    let decoded: any = idToken.decodePayload();
    this.sessionService.saveUserSession(new User(decoded['cognito:username'], "", decoded.given_name, decoded.family_name, decoded.email, (decoded['cognito:groups']? decoded['cognito:groups'][0]: "User"), (decoded["custom:subscribed"]? decoded["custom:subscribed"]: "false")));
    (<AWS.CognitoIdentityCredentials>AWS_Data.AWS.config.credentials).refresh((error)=>{
      if (error) {
        console.error('Failure on .refresh(): ', error);
      } else {
        console.log('Successfully logged!');
        }
    });
  }

  cognitoLogout(){
    if(AWS_Data.cognitoUser){
      AWS_Data.cognitoUser.globalSignOut({
        onSuccess: function (result) {
          console.log("Successfully signed out and invalidated all app records.");
        },
        onFailure: function(err) {
          console.log(JSON.stringify("Error with Global Sign-out: ", err));
        }
      });
    }

    sessionStorage.clear();
    console.log("logged out");
  }

  logCredentials(){
    console.log(AWS_Data.cognitoUser);
  }

}
