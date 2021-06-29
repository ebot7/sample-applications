import axios from 'axios'
import { putItem } from './helpers/dynamoClient'
import { installApplication } from './helpers/ebot7-application-install'
import { getSecretFromSecretsManager } from './helpers/get-secret-from-secrets-manager'

export async function handler(event) {
	let result = "successfully stored credentials and installed the application"
	try {
		console.log('aefof')
		const { 
			FACEBOOK_APP_ID: clientId,
			FACEBOOK_CLIENT_SECRET: clientSecret,
			ACCESS_TOKEN: appKey
		} = await getSecretFromSecretsManager(process.env.secretsManagerPath)
		console.log('befof', clientId, clientSecret, appKey)
		const { code, state } = event.queryStringParameters
		console.log('cefof')
		const {botId, pageId, accessToken: installationToken } = convertStateParamToObject(state)
		console.log('defof', botId, pageId, installationToken)
		// Exchange access code for token
		const token = await exchangeCodeForToken({ code, pageId, clientId, clientSecret })
		// Store everything in DynamoDB
		await putItem(botId, pageId, token)
		console.log('hefof')
		// Verify installation with e-bot7 Application Platform
		await installApplication(appKey, installationToken)
		console.log('iefof')
	} catch(err) {
		result = err.message
	}
	return {
		statusCode: 200,
		body: result
	}
}
/**
 * This function can be replaced to fit the requirements of whatever platform is being integrated with.
 * 	In this case it exchanges an access code for a short-lived user token,
 * 	exchanges the short-lived user token for a long-lived user token,
 * 	and and exchanges the long-lived user token for a long-lived page token.
 * @returns a long-lived Facebook page access token
 */
async function exchangeCodeForToken({ code, pageId, clientId, clientSecret }) {
	console.log('eefof')
	// Should be replaced with whatever endpoint this function is deployed
	const redirect_uri = 'https://n4oyvwukuc.execute-api.eu-central-1.amazonaws.com/dev/ebot7-sample-oauth'
	// Exchange code for short-lived user token
	let URL = `https://graph.facebook.com/v11.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirect_uri}&client_secret=${clientSecret}&code=${code}`
	let response = await axios.get(URL)
	const shortLivedUserToken = response.data.access_token

	console.log('fefof')
	// Exchange short-lived token for long-lived user token
	URL = `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${shortLivedUserToken}`
	response = await axios.get(URL)
	const longLivedUserToken = response.data.access_token

	console.log('gefof', JSON.stringify(response.data, null, 2))
	// Exchange long-lived user token for page access token
	URL = `https://graph.facebook.com/${pageId}?fields=access_token&access_token=${longLivedUserToken}`
	response = await axios.get(URL)
	console.log('ggefof', JSON.stringify(response.data, null, 2))
	const pageAccessToken = response.data.access_token
	return pageAccessToken
}

function convertStateParamToObject(state) {
	console.log('here is the state', state)
	return JSON.parse(decodeURIComponent(state))
}