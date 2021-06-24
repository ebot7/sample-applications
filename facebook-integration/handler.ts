import { APIGatewayEvent, Context, Handler } from "aws-lambda";
import { Ebot7ConvWrapper } from "./helpers/ebot7-conv-wrapper";
import { sendMessage } from "./helpers/facebook-send";
import environment from "./environment";
import { validateEvent } from "./helpers/validate-event";
import { promises as fsPromises } from "fs";

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
    await sendMessage("TODO-oauth-fb-token", fbRecipientId, message);
  } catch (e) {
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
