// lib/auth.ts
import bcrypt from 'bcryptjs';

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12); // 12 is the number of salt rounds
}
