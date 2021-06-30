import * as AWS from "aws-sdk";
import { initEnvironment } from "../environment";

const docClient = new AWS.DynamoDB.DocumentClient();

export const getItemByBotId = async (botId: string) => {
  const environment = await initEnvironment();

  return new Promise((resolve, reject) => {
    const params = {
      TableName: environment.awsDynamoTable,
      FilterExpression: "botId = :botId",
      ExpressionAttributeValues: {
        ":botId": botId,
      },
    };

    docClient.scan(params, (err, data) => {
      if (err) {
        console.error("Error on dbScan ", err);
        reject(err)
      }
      else {
        console.log("dbScan result: ", data);
        resolve(data.Items[0]);
      }
    });
  });
};

export const getItemByPageId = async (pageId: string) => {
  const environment = await initEnvironment();
  console.log('getting by pageId', pageId, typeof pageId, environment.awsDynamoTable)

  return new Promise((resolve, reject) => {
    const params = {
      TableName: environment.awsDynamoTable,
      FilterExpression: "pageId = :pageId",
      ExpressionAttributeValues: {
        ":pageId": pageId,
      },
    };

    docClient.scan(params, (err, data) => {
      if (err) {
        console.error("Error on dbScan ", err);
        reject(err)
      }
      else {
        console.log("dbScan result: ", data);
        resolve(data.Items[0]);
      }
    });
  });
}

export const putItem = async (botId: string, pageId: string, pageAccessToken: string) => {
  const environment = await initEnvironment();

  return new Promise((resolve, reject) => {
    const params = {
      TableName: environment.awsDynamoTable,
      Item: {botId, pageId, pageAccessToken},
    };

    docClient.put(params, function (err, data) {
      if (err) {
        console.log("Error when inserting into DDB", err);
        reject(err)
      } else {
        console.log("Successfully inserted into DDB", data);
        resolve(data)
      }
    });
  });
};
