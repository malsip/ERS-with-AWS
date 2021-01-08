# Project 1 Lambda Backend - 

All three of these functions are used to access my DynamoDB table named reimbursements.  Each of them use a DocumentClient.  Each of them also provide CORS headers on return, but from my understanding only getReimbursementsById needs it.

Includes three lambda functions:
- getReimbursements
- getReimbursementsById
- createReimbursements

### getReimbursements
Straight forward get on a dynamodb table.

### getReimbursementsById
Query for reimbursements based on an author name (I know it says ID but I created this function before I removed the ID).  The author name is passed in as a path variable that is accessed through the event.

### createReimbursements
Simple table put.  This is not only used to create, but also update, since a dynamodb table replaces a record if the key provided matches an existing record.