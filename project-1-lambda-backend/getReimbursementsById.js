let AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
let dc = new AWS.DynamoDB.DocumentClient();

let dataFetch = async (params) => {
     let results = await dc.query(params, (err, data) => {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Items);
        }
    }).promise();
    return results;
};



exports.handler = async (event) => {

    let username = event.path.substring(16);
    let params = {
        TableName: 'reimbursements',
        KeyConditionExpression: 'Author = :username',
        ExpressionAttributeValues: {
            ':username': username
        }
    };
    
    console.log("path: ", params);

    let data = await dataFetch(params);   
    
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