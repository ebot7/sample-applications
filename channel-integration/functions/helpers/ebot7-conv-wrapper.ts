import {Ebot7Client} from '@ebot7/sdk';

export class Ebot7ConvWrapper {
    private static BASE_URL = `https://api.staging.e-bot7.de`;

    constructor(appToken: string) {
        const client = new Ebot7Client({bearerToken: appToken, baseURL: Ebot7ConvWrapper.BASE_URL});
    }

    async getConversationFbRecipientId(convId: string, botId: string) {
        return '3994360700681664'; // TODO: As soon as inbound flow done, remove hardcoded value
    }
}