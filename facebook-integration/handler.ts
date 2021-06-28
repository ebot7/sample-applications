import { APIGatewayEvent, Context, Handler } from "aws-lambda";
import { Ebot7ConvWrapper } from "./helpers/ebot7-conv-wrapper";
import { sendMessage } from "./helpers/facebook-send";
import environment from "./environment";
import { validateEvent } from "./helpers/validate-event";

interface Response {
  statusCode: number;
  headers?: any;
  body?: string;
}

export const eventsEndpoint: Handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<Response> => {
  const ebot7Event = JSON.parse(event.body);
  console.log(ebot7Event);
  
  const message = ebot7Event.data.body;

  const invalid = validateEvent(event);
  if (invalid) return invalid;

  try {
    const convWrapper = new Ebot7ConvWrapper(environment.appKey);
    const { botId, convId } = ebot7Event.data;
    const fbRecipientId = await convWrapper.getConversationFbRecipientId(
      convId,
      botId
    );
    const cleanMessage = message.replace(/<\/?[^>]+(>|$)/g, ""); // remove html tags
    await sendMessage(environment.pageAccessToken, fbRecipientId, cleanMessage);
    console.log('Sent message');
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: e.message };
  }

  return { statusCode: 200 };
};

export const redirectEndpoint: Handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<Response> => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: 'TODO',
  };
  // callback will send HTML back
  return response
};
