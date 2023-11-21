// lib/auth.ts
import bcrypt from 'bcryptjs';

/**
 * Verifies if a plain password matches a hashed password.
 * @param plainPassword - The plain password to be verified.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A Promise that resolves to a boolean indicating whether the passwords match.
 */
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12); // 12 is the number of salt rounds
}
