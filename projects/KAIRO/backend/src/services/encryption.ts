import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

if (!process.env.ENCRYPTION_KEY) {
  console.warn('⚠️  ENCRYPTION_KEY not set in environment variables. Using random key (data will not persist across restarts).');
}

export class EncryptionService {
  private static getKey(): Buffer {
    return Buffer.from(ENCRYPTION_KEY, 'hex');
  }

  /**
   * Encrypts a string value
   * @param text - The text to encrypt
   * @returns Encrypted string in format: iv:tag:encryptedData
   */
  static encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipher(ALGORITHM, this.getKey());
      cipher.setAAD(Buffer.from('broker-credentials'));
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      // Return format: iv:tag:encryptedData
      return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Decrypts an encrypted string
   * @param encryptedText - The encrypted text in format: iv:tag:encryptedData
   * @returns Decrypted string
   */
  static decrypt(encryptedText: string): string {
    try {
      const parts = encryptedText.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }

      const [ivHex, tagHex, encrypted] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const tag = Buffer.from(tagHex, 'hex');
      
      const decipher = crypto.createDecipher(ALGORITHM, this.getKey());
      decipher.setAAD(Buffer.from('broker-credentials'));
      decipher.setAuthTag(tag);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Encrypts broker credentials object
   * @param credentials - The credentials object to encrypt
   * @returns Object with encrypted credential fields
   */
  static encryptCredentials(credentials: {
    apiKey: string;
    apiSecret: string;
    accessToken?: string;
    refreshToken?: string;
  }) {
    return {
      apiKey: this.encrypt(credentials.apiKey),
      apiSecret: this.encrypt(credentials.apiSecret),
      accessToken: credentials.accessToken ? this.encrypt(credentials.accessToken) : null,
      refreshToken: credentials.refreshToken ? this.encrypt(credentials.refreshToken) : null,
    };
  }

  /**
   * Decrypts broker credentials object
   * @param encryptedCredentials - The encrypted credentials object
   * @returns Object with decrypted credential fields
   */
  static decryptCredentials(encryptedCredentials: {
    apiKey: string;
    apiSecret: string;
    accessToken?: string | null;
    refreshToken?: string | null;
  }) {
    return {
      apiKey: this.decrypt(encryptedCredentials.apiKey),
      apiSecret: this.decrypt(encryptedCredentials.apiSecret),
      accessToken: encryptedCredentials.accessToken ? this.decrypt(encryptedCredentials.accessToken) : undefined,
      refreshToken: encryptedCredentials.refreshToken ? this.decrypt(encryptedCredentials.refreshToken) : undefined,
    };
  }

  /**
   * Validates if a string is properly encrypted
   * @param encryptedText - The text to validate
   * @returns True if the text appears to be encrypted
   */
  static isEncrypted(encryptedText: string): boolean {
    const parts = encryptedText.split(':');
    return parts.length === 3 && 
           parts.every(part => /^[0-9a-f]+$/i.test(part)) &&
           parts[0].length === IV_LENGTH * 2 && // IV should be 32 hex chars
           parts[1].length === TAG_LENGTH * 2;  // Tag should be 32 hex chars
  }

  /**
   * Generates a secure random string for API keys or secrets
   * @param length - Length of the random string
   * @returns Random hex string
   */
  static generateSecureRandom(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }
}

// Utility function to ensure encryption key is properly set
export function validateEncryptionSetup(): void {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is required for production use');
  }
  
  try {
    const testData = 'test-encryption';
    const encrypted = EncryptionService.encrypt(testData);
    const decrypted = EncryptionService.decrypt(encrypted);
    
    if (decrypted !== testData) {
      throw new Error('Encryption/decryption test failed');
    }
  } catch (error) {
    throw new Error(`Encryption setup validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}