import { Ebot7Client, Ebot7ConversationClient, Ebot7ExternalConversationClient, Ebot7MessageClient } from '@ebot7/sdk'
/**
 * 
 * @param type The client type that should be returned
 * @returns an e-bot7 API client of the specified type. Authenticated using environment variables specified in serverless.yml.
 */
export function getClient(type: "convs" | "external-convs" | "messages") {
	const client = new Ebot7Client({
		bearerToken: process.env.token,
		baseURL: process.env.baseUrl,
	});
	switch (type) {
		case "convs":
			return new Ebot7ConversationClient(client)
		case "external-convs":
			return new Ebot7ExternalConversationClient(client)
		case "messages":
			return new Ebot7MessageClient(client)
		default:
			throw new Error("unknown client type")
	}
}