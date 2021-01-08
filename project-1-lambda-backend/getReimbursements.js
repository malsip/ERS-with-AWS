let AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
let dc = new AWS.DynamoDB.DocumentClient();

let params = {
    TableName: 'reimbursements',
};

let dataScan = async () => {
     let scanResults = await dc.scan(params, (err, data) => {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Items);
        }
    }).promise();
    return scanResults;
};



exports.handler = async (event) => {

    let data = await dataScan();   
    
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers" : "Content-Type, Authorization"
        },
        body: JSON.stringify(data),
    };
    return response;
};