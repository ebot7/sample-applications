import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { Ebot7Client, Ebot7MessageClient } from '@ebot7/sdk'
import { SecretsManagerClient, GetSecretValueCommand, SecretsManager } from "@aws-sdk/client-secrets-manager";

// Event handler function.
// Prints an array of e-bot7 message objects from a single conversation.
export const createTranscript: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const { data: { botId, convId } } = JSON.parse(event.body)
  const messages = await getMessages({ botId, convId })
  processTranscript({ messages, botId, convId })
  cb(null, { statusCode: 200, body: "successfully created transcript" })
}

async function getMessages({ botId, convId }) {
  const client = await getMessagesClient()
  const messages = await client.findManyByConversation({
    botId, convId
  })
  return messages
}

async function getMessagesClient() {
  return new Ebot7MessageClient(await getEb7Client())
}

async function getEb7Client() {
  const bearerToken = await getSecretFromSecretsManager(process.env.token)
  return new Ebot7Client({
    bearerToken,
    baseURL: 'https://api.production.e-bot7.de'
  })
}

// This mock handler just prints a simple transcript object.
// In real applications this would probably be replaced with something like an API call to a CRM.
function processTranscript({ messages, botId, convId }) {
  const transcript = {
    timeStamp: new Date(),
    botId,
    convId,
    messages
  }
  console.log(transcript)
}

// This function retrieves a secret from AWS Secrets Manager using an env variable as a key.
// This is not part of the e-bot7 Application Platform, it is just a basic implementation of a secure mechanism for storing keys.
async function getSecretFromSecretsManager(secretId) {
  console.log('oh boy', secretId)
  const sm = new SecretsManagerClient({
    region: 'eu-central-1'
  })
  const command = new GetSecretValueCommand({
    SecretId: secretId
  })
  const response = await sm.send(command)
  console.log(response)
  return response
}
