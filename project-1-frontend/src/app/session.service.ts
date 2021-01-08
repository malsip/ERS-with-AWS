import { Injectable } from '@angular/core';
import { AWS_Data } from './AWS-data';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  saveUserSession(user: User){
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  getUserSession(): User{
    return <User>JSON.parse(sessionStorage.getItem("user"));
  }

  saveCognitoIdToken(IdToken){
    sessionStorage.setItem("idToken", JSON.stringify(IdToken));
  }

  getCognitoIdToken(){
    return JSON.parse(sessionStorage.getItem("idToken"));
  }

  saveCognitoAccessToken(AccessToken){
    sessionStorage.setItem("accessToken", JSON.stringify(AccessToken));
  }

  getCognitoAccessToken(){
    return JSON.parse(sessionStorage.getItem("accessToken"));
  }
}
