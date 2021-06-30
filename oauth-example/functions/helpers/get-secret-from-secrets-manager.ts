import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export const getSecretFromSecretsManager = async (secretId: string) => {
  const sm = new SecretsManagerClient({
    region: "eu-central-1",
  });
  const command = new GetSecretValueCommand({
    SecretId: secretId,
  });
  const response = await sm.send(command);
  return JSON.parse(response.SecretString);
};
