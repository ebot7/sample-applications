import { getSecretFromSecretsManager } from "./get-secret-from-secrets-manager"

export const initEnvironment = async () => {
    const {ACCESS_TOKEN: appKey} = await getSecretFromSecretsManager(process.env.secretsManagerPath);

    return {
        appKey,
        awsDynamoTable: process.env.awsDynamoTable
    }
}