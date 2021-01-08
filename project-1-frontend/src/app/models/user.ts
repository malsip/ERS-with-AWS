export class User{
    username : string;
    password : string;
    firstName : string;
    lastName : string;
    email : string;
    role : string;
    subscribed : string;

    constructor( username : string, 
                password : string, 
                firstName : string, 
                lastName : string, 
                email : string, 
                role : string,
                subscribed : string){
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.subscribed = subscribed;
    }
}