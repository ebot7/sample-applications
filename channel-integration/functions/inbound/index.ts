import { IFacebookEvent } from "../../interfaces"
import { getClient } from "../utils/getClient"

/**
 * This function receives webhook events from Facebook.
 * It parses the webhook payload and creates message objects in e-bot7 format.
 * To send the message it finds an e-bot7 conversation associated with the Facebook page and user.
 * If it does not find a conversation it creates one.
 * @param event 
 * @param context 
 * @param callback 
 */
export async function handler (event, context, callback) {
	try {
		const payload: IFacebookEvent = event.body
		console.log("Got event", JSON.stringify(payload, null, 2))
		// Parse webhook event
		const messageData = parseWebhookPayload(payload)
	
		// Create/Fetch e-bot7 conversation
		const mappingData = getConversationMappingData(messageData)
		const conv = await findOrCreateConversation(mappingData)
	
		// Send messages to conv
		await sendMessagesToConv(messageData, conv)
	
		callback(null, {
			statusCode: 200,
			body: "Message received"
		})
	} catch (err) {
		console.error("Failed to receive message", JSON.stringify(err, null, 2))
		// Return a 200 status code because Facebook will stop sending failing webhooks events.
		callback(null, {
			statusCode: 200,
			body: "Failed to receive message"
		})
	}
}

/**
 * This function is written such that it parses Facebook events.
 * It could be reimplemented such that it parses events from another platform.
 * @param payload
 * @returns data required to map between Facebook conversations and e-bot7 conversations and the contents of the messages
 */
function parseWebhookPayload(payload: IFacebookEvent) {
	return payload.entry.reduce((acc, entry) => {
		return acc.concat(entry.messaging.map(message => ({
			senderId: message.sender.id,
			pageId: message.recipient.id,
			body: message.postback?.payload || message.message?.text,
			source: "visitor"
		})))
	}, [])
}

/**
 * @param messageData 
 * @return information that can be used to map between an e-bot7 conversation and a Facebook conversation. Assumes that every message in the event has the same sender and recipient 
 */
function getConversationMappingData(messageData) {
	return messageData.map(({ senderId, pageId }) => ({
		externalData: [{
			// Conversations can be uniquely identified by the id of the message sender and the id of the page they are messaging
			id: `${senderId}-${pageId}`,
			name: "Facebook"
		}]
	}))
}

async function findOrCreateConversation(mappingData) {
	let client = await getClient()
	let conv = await client.externalConvs.findOne(mappingData.externalData[0].id)
	if (!conv.item) {
		conv = await client.convs.create(mappingData)
	}
	return conv 
}

async function sendMessagesToConv(messages, conv) {
	let client = await getClient()
	for(const message of messages) {
		const { body, source } = message
		await client.messages.create({
			botId: conv.botId,
			convId: conv._id,
			payload: {
				body: transformBody(body),
				source
			}
		})
	}
}

function transformBody(body) {
	// Unimplemented function that would transform Facebook markdown to HTML.
	return body
}