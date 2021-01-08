import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { url } from './backendLocation';
import { Observable, of } from 'rxjs';
import { Reimbursement } from './models/reimbursements';
import { SessionService } from './session.service';
import { S3 } from 'aws-sdk';
import { AWS_Data } from './AWS-data';


@Injectable({
  providedIn: 'root'
})
export class ReimbursementsService {

  constructor(private http: HttpClient, private sessionService: SessionService) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
    withCredentials:false
  };

  getAllReimbursements(): Observable<{statusCode: number, body:string}> {
    this.generateHttpOtptions();
    return this.http.get<{statusCode: number, body:string}>(`${url}/reimbursements`, this.httpOptions);
  }

  getMyReimbursements(): Observable<any> {
    this.generateHttpOtptions();
    return this.http.get<any>(`${url}/reimbursements/${this.sessionService.getUserSession().username}`, this.httpOptions);
  }

  createReimbursement(params): Observable<{statusCode: number, body:string}> {
    this.generateHttpOtptions();
    return this.http.post<{statusCode: number, body:string}>(`${url}/reimbursements`, params, this.httpOptions);
  }

  updateReimbursement(params): Observable<{statusCode: number, body:string}> {
    this.generateHttpOtptions();
    return this.http.put<{statusCode: number, body:string}>(`${url}/reimbursements`, params, this.httpOptions);
  }

  // async getReceipt(reimbursement: Reimbursement, key: string): Promise<Reimbursement>{
  //   let bucket = new AWS_Data.AWS.S3({
  //     params: {
  //       Bucket: AWS_Data.bucketName
  //     }
  //   });
    
  //   let objParams = {
  //     Bucket: AWS_Data.bucketName,
  //     Key: key,
  //   };

  //   let receipt = async ()=> {
  //     let r = await bucket.getObject(objParams, (err, data)=>{
  //       if (err) console.log("s3 error: ", err, err.stack); // an error occurred
  //       else     console.log("s3 success: ", data);           // successful response 
  //     }).promise();
  //     return r;
  //   }

  //   console.log(receipt());
  //   reimbursement.receipt = (await receipt()).Body;
  //   return reimbursement;
    
  // }

  createReimbursementWithReceipt(params, image: any): Observable<{statusCode: number, body:string}>{
    let bucket = new AWS_Data.AWS.S3({
      params: {
        Bucket: AWS_Data.bucketName
      }
    });

    let objParams = {
      Body: image,
      Bucket: AWS_Data.bucketName,
      Key: 'images/' + (<AWS.CognitoIdentityCredentials>AWS_Data.AWS.config.credentials).identityId + '/' + image.name,
    };

    bucket.putObject(objParams, (err, data)=>{
      if (err) console.log("s3 error: ", err, err.stack); // an error occurred
      else     console.log("s3 success: ", data);           // successful response
    });

    params["Receipt"] = "https://" + AWS_Data.bucketName + ".s3.amazonaws.com/images/" + (<AWS.CognitoIdentityCredentials>AWS_Data.AWS.config.credentials).identityId + '/' + image.name;
    
    this.generateHttpOtptions();
    return this.http.post<{statusCode: number, body:string}>(`${url}/reimbursements`, params, this.httpOptions);
  }

  generateHttpOtptions(){
    if(this.sessionService.getCognitoIdToken()){
      this.httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.sessionService.getCognitoIdToken().jwtToken}),
        withCredentials:false
      };
    }
  }
}
