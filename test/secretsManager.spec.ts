import { SecretsManagerCache } from '@/secretsManagerCache';
import * as DateMock from 'jest-date-mock';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import sinon from 'sinon';

import { getSecretValueResponseHandler, stringSecretData, jsonSecretData } from './lib/secretManagerMock'

const stringSecretSpy = sinon.spy(
  getSecretValueResponseHandler(stringSecretData)
);
const jsonSecretSpy = sinon.spy(
  getSecretValueResponseHandler(jsonSecretData)
);
AWSMock.setSDKInstance(AWS);

beforeEach(() => {
  stringSecretSpy.resetHistory();
  jsonSecretSpy.resetHistory();
});

afterEach(() => {
  AWSMock.restore();
  DateMock.clear();
});

it('should fetch a secret', async () => {
  AWSMock.mock('SecretsManager', 'getSecretValue', stringSecretSpy);

  const helper = new SecretsManagerCache();
  const secret = await helper.getSecret('secret-value');

  expect(secret).toEqual('secret-string');
  sinon.assert.called(stringSecretSpy);
});

it('should fetch a secret as JSON', async () => {
  AWSMock.mock('SecretsManager', 'getSecretValue', jsonSecretSpy);

  const helper = new SecretsManagerCache();
  const secretJson = await helper.getSecret('secret-value', true);

  expect(secretJson).toEqual({ hello: 'world' });
  sinon.assert.called(jsonSecretSpy);
});

it('should catch error when attempting to parse non-JSON secret as JSON', async () => {
  AWSMock.mock('SecretsManager', 'getSecretValue', stringSecretSpy);

  const helper = new SecretsManagerCache();

  expect(
    helper.getSecret('secret-value', true)
  ).rejects.toThrow()
});

it('should cache secrets', async () => {
  AWSMock.mock('SecretsManager', 'getSecretValue', stringSecretSpy);

  const helper = new SecretsManagerCache();

  await helper.getSecret('secret-1');
  await helper.getSecret('secret-1');

  sinon.assert.calledOnce(stringSecretSpy);

  await helper.getSecret('secret-2');
  await helper.getSecret('secret-2');

  sinon.assert.calledTwice(stringSecretSpy);
});

it('should expire cache after TTL expires', async () => {
  AWSMock.mock('SecretsManager', 'getSecretValue', stringSecretSpy);

  const helper = new SecretsManagerCache({
    ttl: 10 * 1000, // 10 seconds
  });

  await helper.getSecret('secret-value');

  // advance time so TTL has expired
  DateMock.advanceBy(15 * 1000);

  await helper.getSecret('secret-value');

  sinon.assert.calledTwice(stringSecretSpy);
});
