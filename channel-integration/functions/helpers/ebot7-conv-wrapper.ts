import {Ebot7Client, Ebot7ConversationClient} from '@ebot7/sdk';

export class Ebot7ConvWrapper {
    private static BASE_URL = `https://api.staging.e-bot7.de`;
    client: Ebot7ConversationClient;

    constructor(appToken: string) {
        const generalClient = new Ebot7Client({bearerToken: appToken, baseURL: Ebot7ConvWrapper.BASE_URL});
        this.client = new Ebot7ConversationClient(generalClient);
    }

    async getConversationFbRecipientId(convId: string, botId: string) {
        const conv = await this.client.findOne({botId, convId});
        return conv.item.externalData.find(x => x.name === 'facebook').id.split('-')[0]; // should be <SENDER-ID>-<PAGE-ID>
    }
}