import { GetSecretValueResponse } from 'aws-sdk/clients/secretsmanager';

export const stringSecretData: GetSecretValueResponse = {
  ARN: 'arn:aws:secretsmanager:eu-west-1:145927610644:secret:some-key-name-dDxrgw',
  Name: 'some-key-name',
  VersionId: 'e7022304-34ce-4e52-bbb7-8e50e63d1172',
  SecretString: 'secret-string',
  VersionStages: ['AWSCURRENT'],
  CreatedDate: new Date(),
};

export const jsonSecretData: GetSecretValueResponse = {
  ARN: 'arn:aws:secretsmanager:eu-west-1:145927610644:secret:some-key-name-dDxrgw',
  Name: 'some-key-name',
  VersionId: 'e7022304-34ce-4e52-bbb7-8e50e63d1172',
  SecretString: JSON.stringify({
    hello: 'world'
  }),
  VersionStages: ['AWSCURRENT'],
  CreatedDate: new Date(),
};

type Callback = (error: null, response: GetSecretValueResponse) => void

export function getSecretValueResponseHandler(input: GetSecretValueResponse) {
  return function (_: never, cb: Callback): void {
    cb(null, input);
  }
}
