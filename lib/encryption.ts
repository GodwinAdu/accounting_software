import crypto from 'crypto';

// Use a secure encryption key and IV length
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!
const IV_LENGTH = 16;

// Encrypt function
export function encryptApiKey(apiKey: string) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(apiKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

// Decrypt function
export function decryptApiKey(encryptedApiKey: string) {
    const [iv, encrypted] = encryptedApiKey.split(':');
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(ENCRYPTION_KEY, 'hex'),
        Buffer.from(iv, 'hex')
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}