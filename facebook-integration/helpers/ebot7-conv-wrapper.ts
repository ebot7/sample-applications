import {Ebot7Client, Ebot7ConversationClient} from '@ebot7/sdk';

export class Ebot7ConvWrapper {
    private static BASE_URL = `https://api.staging.e-bot7.de`;
    private convClient: Ebot7ConversationClient;

    constructor(appToken: string) {
        const client = new Ebot7Client({bearerToken: appToken, baseURL: Ebot7ConvWrapper.BASE_URL});
        this.convClient = new Ebot7ConversationClient(client);
    }

    private async getConversation(convId: string, botId: string){
        return await this.convClient.findOne({botId, convId});
    }

    async getConversationFbRecipientId(convId: string, botId: string) {
        const conv = await this.getConversation(convId, botId);
        return 'mock-id'; // TODO: As soon as inbound flow done, 'conv.item.meta.fbUserId'
    }
}