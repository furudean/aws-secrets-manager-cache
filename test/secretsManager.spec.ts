import sinon from 'sinon';
import { GetSecretValueResponse } from 'aws-sdk/clients/secretsmanager';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { SecretsManagerCache } from '@/secretsManagerCache';
import * as DateMock from 'jest-date-mock';

const getSecretValueResponse: GetSecretValueResponse = {
  ARN: 'arn:aws:secretsmanager:eu-west-1:145927610644:secret:some-key-name-dDxrgw',
  Name: 'some-key-name',
  VersionId: 'e7022304-34ce-4e52-bbb7-8e50e63d1172',
  SecretString: 'secret-string',
  VersionStages: ['AWSCURRENT'],
  CreatedDate: new Date(),
};

function getSecretValueResponseHandler (input: never, cb: any): void {
  cb(null, getSecretValueResponse);
}

const getSecretValueResponseSpy = sinon.spy(getSecretValueResponseHandler);
AWSMock.setSDKInstance(AWS);

beforeEach(() => {
  getSecretValueResponseSpy.resetHistory();
  AWSMock.mock('SecretsManager', 'getSecretValue', getSecretValueResponseSpy);
});

afterEach(() => {
  AWSMock.restore();
  DateMock.clear();
});

it('should fetch a secret', async () => {
  const helper = new SecretsManagerCache();
  const secret = await helper.getSecretString('secret-value');

  expect(secret).toEqual('secret-string');
  sinon.assert.called(getSecretValueResponseSpy);
});

it('should cache secrets', async () => {
  const helper = new SecretsManagerCache();

  await helper.getSecretString('secret-1');
  await helper.getSecretString('secret-1');

  sinon.assert.calledOnce(getSecretValueResponseSpy);

  await helper.getSecretString('secret-2');
  await helper.getSecretString('secret-2');

  sinon.assert.calledTwice(getSecretValueResponseSpy);
});

it('should expire cache after TTL expires', async () => {
  const helper = new SecretsManagerCache({
    ttl: 10 * 1000, // 10 seconds
  });

  await helper.getSecretString('secret-value');

  // advance time so TTL has expired
  DateMock.advanceBy(15 * 1000);

  await helper.getSecretString('secret-value');

  sinon.assert.calledTwice(getSecretValueResponseSpy);
});
