import { getSecretFromSecretsManager } from "./helpers/get-secret-from-secrets-manager"

export const initEnvironment = async () => {
    const {ACCESS_TOKEN: appKey} = await getSecretFromSecretsManager(process.env.token);

    return {
        appKey,
        awsDynamoTable: process.env.awsDynamoTable
    }
}