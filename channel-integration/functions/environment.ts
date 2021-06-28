import { getSecretFromSecretsManager } from "./helpers/get-secret-from-secrets-manager"

export const initEnvironment = async () => {
    const {ACCESS_TOKEN: appKey} = await getSecretFromSecretsManager(process.env.token);

    return {
        appKey,
        awsConfiguration: {
            region: "eu-central-1",
            secretAccessKey: process.env.secretAccessKey,
            accessKeyId: process.env.accessKeyId,
        },
        awsDynamoTable: process.env.awsDynamoTable
    }
}