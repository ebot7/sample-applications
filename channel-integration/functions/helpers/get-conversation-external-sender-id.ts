import { getClient } from './getClient';

export const getConversationExternalSenderId = async (convId: string, botId: string) => {
    const client = (await getClient()).convs;
    const conv = await client.findOne({botId, convId});
    return conv.item.externalData.find(x => x.name === 'facebook').id.split('-')[0]; // should be <SENDER-ID>-<PAGE-ID>
}