import { Component, OnInit } from '@angular/core';
import { AWS_Data } from '../AWS-data';
import { LoginService } from '../login.service'
import { Credentials } from '../models/credentials';
import { Reimbursement } from '../models/reimbursements';
import { User } from '../models/user';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService, public sessionService: SessionService) { }

  ngOnInit(): void {
  }

  user: User = this.sessionService.getUserSession();
  credentials: Credentials = new Credentials("","");
  emailCode: string = "";

  onLogin(){
    this.loginService.cognitoLogin(this.credentials);
  }

  onLogout(){
    this.loginService.cognitoLogout();
    this.user = null;
  }

  logCredentials(){
    this.loginService.logCredentials();
  }

  // verifyEmail(){
  //   let cisp = new AWS_Data.AWS.CognitoIdentityServiceProvider();

  //   let params = {
  //     UserPoolId: AWS_Data.poolData.UserPoolId,
  //     Filter: `username = \"${this.sessionService.getUserSession().username}\"`
  //   }

  //   cisp.listUsers(params, (err, data)=>{
  //     if (err) console.log("cognitoUsers: ", err, err.stack); // an error occurred
  //     else {
  //       console.log("cognitoUsers: ", data.Users);           // successful response
  //       data.Users.forEach(item=>{
  //         console.log(item.Attributes[1].Value)
  //         if(item.Attributes[1].Value == "false"){
  //           let verifyParams = {
  //             AccessToken: this.sessionService.getCognitoAccessToken(),
  //             AttributeName: 'email',
  //             Code: this.emailCode
  //           }

  //           cisp.verifyUserAttribute(verifyParams, (err, data)=>{
  //             if (err) console.log("verifyUserAttriubte failure: ", err, err.stack); // an error occurred
  //             else     console.log("verifyUserAttriubte success: ", data);           // successful response
  //           })
  //         }
  //       });
  //     }    
  //   });
  // }

  // requestNewCode(){
    
  // }
}
