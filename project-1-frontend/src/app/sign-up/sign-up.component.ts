import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { User } from '../models/user';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }

  newUser: User = new User("d","fasters","a","g","em@il.com","User", "false");

  submitNewUser(){
    this.loginService.cognitoSignUp(this.newUser);
  }

}
