import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

const EVENT_MESSAGE_CREATED_NAME = 'message:created';
type Source = 'visitor' | 'bot' | 'agent';

export const eventsEndpoint: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const ebot7Event = JSON.parse(event.body);
  const {eventName, data} = ebot7Event;
  const {body: message} = data;
  const source: Source = data.source;

  if (eventName !== EVENT_MESSAGE_CREATED_NAME) {
    return cb(null, {statusCode: 404, body: `Invalid event received: ${eventName}`});
  }
  if (source === 'visitor') {
    return cb(null, {statusCode: 404, body: `Invalid source received: ${source}. This endpoint forwards facebook messages only when bot or agent send a message`});
  }

  // TOOD: send message on facebook
  

  cb(null, {statusCode: 200});
}