import { SecretsManager } from 'aws-sdk';

const defaultTTL = (5 * 60 * 1000); // 5 minutes

export class CachedSecret {
  public value: string;
  public ttl: number;
  public expiresAt: number;

  constructor(value: string, ttl: number) {
    this.value = value;
    this.ttl = ttl;
    this.expiresAt = Date.now() + ttl;
  }

  hasExpired(): boolean {
    return (Date.now() > this.expiresAt);
  }
}

export type SecretsManagerCacheOptions = Partial<SecretsManagerCacheConfig>

interface SecretsManagerCacheConfig {
  /**
   * How many milliseconds to cache each secret for.
   * @default 300000
   */
  ttl: number;
  /** AWS SDK SecretsManager instance */
  secretsManager: SecretsManager;
}

export class SecretsManagerCache {
  public config: SecretsManagerCacheConfig;
  private cache = new Map<string, CachedSecret>()

  constructor (options?: SecretsManagerCacheOptions) {
    this.config = {
      // set defaults
      ttl: defaultTTL,
      secretsManager: new SecretsManager(),
      // replace defaults with input options
      ...options,
    };
  }

  /**
   * Fetches a secret from SecretsManager and caches it as long as the given
   * `ttl`.
   */
  async getSecretString(secretName: string): Promise<string | undefined> {
    const itemExistsInCache = this.cache.has(secretName);
    const itemHasExpired = this.cache.get(secretName)?.hasExpired();

    if (!itemExistsInCache || itemHasExpired) {
      const getSecretValueResponse = await this.config.secretsManager
        .getSecretValue({ SecretId: secretName })
        .promise();

      if (getSecretValueResponse.SecretString) {
        this.cache.set(
          secretName,
          new CachedSecret(
            getSecretValueResponse.SecretString,
            this.config.ttl,
          )
        );
      }
    }

    return this.cache.get(secretName)?.value;
  }
}
