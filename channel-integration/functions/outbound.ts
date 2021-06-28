import { APIGatewayEvent, Context, Handler } from "aws-lambda";
import { Ebot7ConvWrapper } from "./helpers/ebot7-conv-wrapper";
import { sendMessage } from "./helpers/facebook-send";
import {initEnvironment} from "./environment";
import { validateEvent } from "./helpers/validate-event";
import { getItem } from "./helpers/dynamoClient";

interface Response {
  statusCode: number;
  headers?: any;
  body?: string;
}

/**
 * This endpoint handles all messages created events sent
 * by the ebot7 backend and sends a message to the related facebook conversation
 * @param event 
 * @param context 
 * @returns 
 */
export const eventsEndpoint: Handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<Response> => {
  const environment = await initEnvironment();
  
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
    const dynamoItem = await getItem(botId);
    console.log('Dynamo Item: ', dynamoItem);
    
    await sendMessage((dynamoItem as any).pageAccessToken, fbRecipientId, cleanMessage);
    console.log('Sent message');
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: e.message };
  }

  return { statusCode: 200 };
};