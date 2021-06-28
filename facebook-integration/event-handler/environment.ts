import { getSecretFromSecretsManager } from "./helpers/get-secret-from-secrets-manager"

export const initEnvironment = async () => {
    const {ACCESS_TOKEN: appKey} = await getSecretFromSecretsManager(process.env.appKeySecretId);

    return {
        appKey,
        awsConfiguration: {
            region: "eu-central-1",
            secretAccessKey: "2e5BnEN/Y50F3GjQEbXhGmr4qKbSvBp+vOTVSSR3",
            accessKeyId: "AKIAQ4KIGWM3GO5VYS7S",
        },
        awsDynamoTable: 'facebookAuth'
    }
}