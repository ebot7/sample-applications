import * as AWS from "aws-sdk";
import {initEnvironment} from "../environment";


export const getItem = async (botId: string) => {
    const environment = await initEnvironment();

    AWS.config.update({...environment.awsConfiguration});
    const docClient = new AWS.DynamoDB.DocumentClient();

    return new Promise((resolve, reject) => {
        const params = {
            TableName: environment.awsDynamoTable,
            FilterExpression: "botId = :botId",
            ExpressionAttributeValues: {
                ":botId": { S: botId },
              },
        };
    
        docClient.scan(params, (err, data) => {
            if (err) console.error('Error on dbScan ', err);
            else {
                console.log('dbScan result: ', data);
                resolve(data.Items[0]);
            }
        })
    })
}