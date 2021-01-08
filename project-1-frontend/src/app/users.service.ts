import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { url } from './backendLocation';
import { SessionService } from './session.service';
import { AWS_Data } from './AWS-data';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private sessionService: SessionService) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
    withCredentials:false
  };

  generateHttpOtptions(){
    if(this.sessionService.getCognitoIdToken()){
      this.httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.sessionService.getCognitoIdToken().jwtToken}),
        withCredentials:false
      };
    }
  }

  // async getCognitoUsers(): Promise<any>{

  //   let cisp = new AWS_Data.AWS.CognitoIdentityServiceProvider();

  //   let params = {
  //     UserPoolId: AWS_Data.poolData.UserPoolId,
  //   }
    

  //   let results;

  //   await cisp.listUsers(params, (err, data)=>{
  //     if (err) console.log("cognitoUsers: ", err, err.stack); // an error occurred
  //     else {
  //       console.log("cognitoUsers: ", data);           // successful response
  //       results = data;

  //     }    
  //   });


  //}
  

}
