import { APIGatewayEvent, Context, Handler } from "aws-lambda";
import { IResponse } from "../interfaces";
import { initEnvironment } from "./environment";
import { putItem } from "./helpers/dynamoClient";
import { installApplication } from "./helpers/ebot7-application-install";

/**
 * Installs the application with the specified appKey from environment
 * to a bot. It expects as body:
 * { installationAccessToken, botId, pageId, pageAccessToken }
 * @param event 
 * @param context 
 * @returns 
 */
export const applicationInstall: Handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<IResponse> => {
    const environment = await initEnvironment();

    const {installationAccessToken, botId, pageId, pageAccessToken} = JSON.parse(event.body);
    const appKey = environment.appKey;

    await putItem(botId, pageId, pageAccessToken);
    await installApplication(appKey, installationAccessToken);
    return {statusCode: 200, body: 'Successfully installed'};
};