# aws-secrets-manager-cache

A package to help you out when wanting to cache items from AWS Secrets Manager.

## List of features

* Cache stuff
* It's awesome
* Key feature 3

## Install

``` shell
$ npm i aws-secrets-manager-cache
```

## Usage

``` js
const helper = new SecretsManagerCache();
const secret = await helper.getSecret('secret-value');
```

### JSON

To fetch the secret as JSON, send in `true` as the second argument

``` js
try {
    const helper = new SecretsManagerCache();
    const secretJson = await helper.getSecret('secret-value', true);
} catch (error) {
    console.log(error.message;)
}
```

### Contributing

Keep it simple. Keep it minimal.
