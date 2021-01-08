import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { AWS_Data } from '../AWS-data';
import { handleError } from '../handleError';
import { Reimbursement } from '../models/reimbursements';
import { User } from '../models/user';
import { ReimbursementsService } from '../reimbursements.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-reimbursements',
  templateUrl: './reimbursements.component.html',
  styleUrls: ['./reimbursements.component.css']
})
export class ReimbursementsComponent implements OnInit {

  constructor(private reimbursementsService: ReimbursementsService, public sessionService: SessionService) { }

  ngOnInit(): void {
  }

  reimbursements: Reimbursement[] = [];
  createReimbursement: boolean = false;
  newReimbursement: Reimbursement = new Reimbursement(this.sessionService.getUserSession().username, 0, "", null, "", null, "Pending", "Lodging");
  recentlySubmitted: string = "";
  receipt: any = null;

  getAllReimbursements(){
    this.reimbursementsService.getAllReimbursements().subscribe(response => {
      let responseItems: any[];
      responseItems = JSON.parse(response.body).Items;
      this.reimbursements = [];
      responseItems.forEach(async item => {
        let r: Reimbursement = new Reimbursement(item.Author, item.Amount, item.Time_Submitted, item.Time_Resolved, item.Description, item.Resolver, item.Status, item.Type, item.Receipt)
        this.reimbursements.push(r);
      
      });
    });


    this.recentlySubmitted = "";
  }

  getMyReimbursements(){
    this.reimbursementsService.getMyReimbursements().subscribe(response => {
      let responseItems: any[];
      responseItems = response.Items;
      this.reimbursements = [];
      responseItems.forEach(item => {
        let r: Reimbursement = new Reimbursement(item.Author, item.Amount, item.Time_Submitted, item.Time_Resolved, item.Description, item.Resolver, item.Status, item.Type, item.Receipt);
        this.reimbursements.push(r);
      });
    });

    this.recentlySubmitted = "";
  }

  showCreateReimbursement(){
    this.createReimbursement = true;
    this.recentlySubmitted = "";
  }

  submitNewReimbursement(){
    let d = new Date(Date.now());
    this.newReimbursement.dateSubmitted = d.toUTCString();

    let params = {
      "Author": this.newReimbursement.author,
      "Amount": this.newReimbursement.amount,
      "Description": this.newReimbursement.description,
      "Time_Submitted": this.newReimbursement.dateSubmitted,
      "Type": this.newReimbursement.type,
      "Status": "Pending"
    }

    if(this.receipt != null){
      this.reimbursementsService.createReimbursementWithReceipt(params, this.receipt).pipe(
        catchError(handleError<{statusCode: number, body:string}>())
      ).subscribe(reimbursement => {
        this.createReimbursement = false;
        if(typeof(reimbursement) != "undefined"){
          this.recentlySubmitted = "Reimbursement Submittion Successful";
        }
        else{
          this.recentlySubmitted = "Reimbursement Submittion Failed";
        }
      });
    }
    else{
      this.reimbursementsService.createReimbursement(params).pipe(
        catchError(handleError<{statusCode: number, body:string}>())
      ).subscribe(reimbursement => {
        this.createReimbursement = false;
      });
    }
    
  }

  updateReimbursement(reimbursement: Reimbursement, status: string){
    reimbursement.status = status;
    reimbursement.resolver = this.sessionService.getUserSession().username;
    let d = new Date(Date.now());
    reimbursement.dateResolved = d.toUTCString();


    let params = {
      "Author": reimbursement.author,
      "Amount": reimbursement.amount,
      "Description": reimbursement.description,
      "Time_Submitted": reimbursement.dateSubmitted,
      "Time_Resolved": reimbursement.dateResolved,
      "Resolver": reimbursement.resolver,
      "Type": reimbursement.type,
      "Status": status,
    }
    if(reimbursement.receipt){
      params["Receipt"] = reimbursement.receipt;
    }

    this.reimbursementsService.updateReimbursement(params).pipe(
      catchError(handleError<{statusCode: number, body:string}>())
    ).subscribe(result => {
        console.log(result);

        let cisp = new AWS_Data.AWS.CognitoIdentityServiceProvider();
        let getUserParams = {
          UserPoolId: AWS_Data.poolData.UserPoolId,
          Filter: `username = \"${reimbursement.author}\"`
        }

        cisp.listUsers(getUserParams, (err, data)=>{
          if (err) console.log("cognitoUsers: ", err, err.stack); // an error occurred
          else {
            console.log("cognitoUsers: ", data);           // successful response

            let ses = new AWS_Data.AWS.SES();

            let sesParams = {
              Destination: {
                ToAddresses: [data.Users[0].Attributes[4].Value]
              },
              Message: {
                Subject: {
                  Charset: "UTF-8",
                  Data: "Reimbusement " + status
                },
                Body: {
                  Text: {
                    Charset: "UTF-8",
                    Data: `Reimbursement by ${reimbursement.author} created at exactly ${reimbursement.dateSubmitted} has been ${status}.  For more information contact your administrator.`
                  }
                }
              },
              Source: "test@email.com"
            }
            console.log(sesParams);

            // ses.sendEmail(sesParams, (err, data)=>{
            //   if (err) console.log("ses failure: ", err, err.stack); // an error occurred
            //   else     console.log("ses success: ", data);           // successful response
            // });

          }    
        });
    });
  }

  // subscribeToReimbursements(){

  // }
  
}

