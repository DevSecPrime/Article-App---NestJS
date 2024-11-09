import { createCipheriv, createDecipheriv } from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Encrypt the password
 * @param textToEncrypt string
 * @returns
 */
export const encrypt = async (textToEncrypt: string) => {
  const AES_ENC_KEY_BUFFER = Buffer.from(process.env.AES_ENC_KEY, 'hex');
  const AES_IV_BUFFER = Buffer.from(process.env.AES_IV, 'hex');

  const cipher = createCipheriv(
    'aes-256-cbc',
    AES_ENC_KEY_BUFFER,
    AES_IV_BUFFER,
  );
  let encrypted = cipher.update(textToEncrypt, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
};

/**
 * decrypt password
 * @param encryptToText
 * @returns
 */
export const decrypt = async (encryptToText: string) => {
  const AES_ENC_KEY_BUFFER = Buffer.from(process.env.AES_ENC_KEY, 'hex');
  const AES_IV_BUFFER = Buffer.from(process.env.AES_IV, 'hex');

  const decipher = createDecipheriv(
    'aes-256-cbc',
    AES_ENC_KEY_BUFFER,
    AES_IV_BUFFER,
  );
  const decrypted = decipher.update(encryptToText, 'base64', 'utf8');
  return decrypted + decipher.final('utf8');
};
