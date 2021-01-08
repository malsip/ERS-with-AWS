let AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
let dc = new AWS.DynamoDB.DocumentClient();

let dataInput = async (params) => {
     let putResults = await dc.put(params, (err, data) => {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Items);
        }
    }).promise();
    return putResults;
};



exports.handler = async (event) => {

    console.log(event)

    let params = {
        TableName: 'reimbursements',
        Item: event
    };

    let data = await dataInput(params);   
    
    
    
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers" : "Content-Type, Authorization"
        },
        body: JSON.stringify(event),
    };
    return response;
};