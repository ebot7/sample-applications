import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

export const integrationNodes: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless (Typescript)! Your function executed successfully!',
      input: event,
    }),
  };

  cb(null, response);
}
