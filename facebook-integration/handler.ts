import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

export const eventsEndpoint: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const body = JSON.parse(event.body);
  console.log(`EVENT: ${body}`);
  cb(null, {statusCode: 200});
}