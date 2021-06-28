import * as AWS from "aws-sdk";
import config from "src/server/config";

AWS.config.update(config.awsConfiguration);

const docClient = new AWS.DynamoDB.DocumentClient();

export const putData = (tableName: string, data: any) => {
  var params = {
    TableName: tableName,
    Item: data,
  };

  docClient.put(params, function (err, data) {
    if (err) {
      console.log("Error when inserting into DDB", err);
    } else {
      console.log("Successfully inserted into DDB", data);
    }
  });
};
