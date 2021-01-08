import { Component, OnInit } from '@angular/core';
import { AWS_Data } from '../AWS-data';
import { User } from '../models/user';
import { SessionService } from '../session.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private usersService: UsersService, public sessionService: SessionService) { }

  users: User[] = [];

  ngOnInit(): void {
  }

  async getAllUsers(){

    let cisp = new AWS_Data.AWS.CognitoIdentityServiceProvider();

    let params = {
      UserPoolId: AWS_Data.poolData.UserPoolId,
    }

    await cisp.listUsers(params, (err, data)=>{
      if (err) console.log("cognitoUsers: ", err, err.stack); // an error occurred
      else {
        console.log("cognitoUsers: ", data.Users);           // successful response
        data.Users.forEach(item=>{
          let u: User = new User(item.Username, "", item.Attributes[2].Value, item.Attributes[3].Value, item.Attributes[4].Value, "", "");
          //console.log(u);
          this.users.push(u);
        });
      }    
    });

  }

}
