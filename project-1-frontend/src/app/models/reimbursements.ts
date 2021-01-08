import { User } from "./user";

export class Reimbursement{
    author : string;
    amount : number;
    dateSubmitted : string;
    dateResolved : string;
    description : string;
    resolver : string;
    status : string;
    type : string;
    receipt : any;

    constructor(author : string, 
                amount : number, 
                dateSubmitted : string, 
                dateResolved : string, 
                description : string, 
                resolver : string, 
                status : string, 
                type : string, 
                receipt? : any){
        this.author = author;
        this.amount = amount;
        this.dateSubmitted = dateSubmitted;
        this.dateResolved = dateResolved;
        this.description = description;
        this.resolver = resolver;
        this.status = status;
        this.type = type;
        this.receipt = receipt;
    }
}