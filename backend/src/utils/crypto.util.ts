import * as crypto from 'crypto';

export class CryptoUtil {
  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  static verifyPassword(password: string, hashStr: string): boolean {
    const [salt, key] = hashStr.split(':');
    if (!salt || !key) return false;
    const hashBuffer = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, 'hex');
    const match = crypto.timingSafeEqual(hashBuffer, keyBuffer);
    return match;
  }

  static generateShortId(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase(); // Example: A1B2C3D4
  }
}
