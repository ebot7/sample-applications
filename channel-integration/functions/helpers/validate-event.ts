import { APIGatewayEvent } from "aws-lambda";


const EVENT_MESSAGE_CREATED_NAME = "message:created";
type Source = "visitor" | "bot" | "agent";

export const validateEvent = (event: APIGatewayEvent) => {
    const ebot7Event = JSON.parse(event.body);
    const { eventName, data } = ebot7Event;
    const source: Source = data.source;
  
    if (eventName !== EVENT_MESSAGE_CREATED_NAME) {
      return { statusCode: 404, body: `Invalid event received: ${eventName}` };
    }
    if (source === "visitor") {
      return {
        statusCode: 200,
        body: `Ignoring message from ${source}. This endpoint forwards facebook messages only when bot or agent send a message`,
      };
    }
  }