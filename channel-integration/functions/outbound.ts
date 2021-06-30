import { APIGatewayEvent, Context, Handler } from "aws-lambda";
import { sendMessage } from "./helpers/facebook-send";
import { validateEvent } from "./helpers/validate-event";
import { getItemByBotId } from "./helpers/dynamoClient";
import {IResponse} from '../interfaces';
import { getConversationExternalSenderId } from "./helpers/get-conversation-external-sender-id";

/**
 * This endpoint handles events sent from ebot7 backend.
 * If the event is of type "message:created", it'll check if it's 
 * from either the agent or the bot.
 * If it is, it will extract the facebookAccessToken from DDB and 
 * send a message on facebook incorporating the page specified by the
 * facebookAccessToken
 * @param event 
 * @param context 
 * @returns 
 */
export const handler: Handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<IResponse> => {
  
  const ebot7Event = JSON.parse(event.body);
  console.log(ebot7Event);
  
  const message = ebot7Event.data.body;

  const invalid = validateEvent(event);
  if (invalid) return invalid;

  try {
    const { botId, convId } = ebot7Event.data;
    const fbRecipientId = await getConversationExternalSenderId(
      convId,
      botId
    );
    const cleanMessage = message.replace(/<\/?[^>]+(>|$)/g, ""); // remove html tags
    const dynamoItem = await getItemByBotId(botId);
    console.log('Dynamo Item: ', dynamoItem);
    
    await sendMessage((dynamoItem as any).pageAccessToken, fbRecipientId, cleanMessage);
    console.log('Sent message');
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: e.message };
  }

  return { statusCode: 200, body: 'Successfully forwarded message to Facebook' };
};