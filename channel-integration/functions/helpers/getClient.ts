import { Ebot7Client, Ebot7ConversationClient, Ebot7ExternalConversationClient, Ebot7MessageClient } from '@ebot7/sdk'
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
/**
 * 
 * @returns an e-bot7 API client of the specified type. Authenticated using environment variables specified in serverless.yml.
 */
export async function getClient() {
  const { ACCESS_TOKEN: bearerToken } = await getSecretFromSecretsManager(process.env.token)
	const client = new Ebot7Client({
		bearerToken,
		baseURL: process.env.apiBaseUrl,
	});
	return {
		convs: new Ebot7ConversationClient(client),
		externalConvs: new Ebot7ExternalConversationClient(client),
		messages: new Ebot7MessageClient(client),
	}
}

// This function retrieves a secret from AWS Secrets Manager using an env variable as a key.
// This is not part of the e-bot7 Application Platform, it is just a basic implementation of a secure mechanism for storing keys.
async function getSecretFromSecretsManager(secretId) {
  const sm = new SecretsManagerClient({
    region: 'eu-central-1'
  })
  const command = new GetSecretValueCommand({
    SecretId: secretId
  })
  const response = await sm.send(command)
  return JSON.parse(response.SecretString)
}