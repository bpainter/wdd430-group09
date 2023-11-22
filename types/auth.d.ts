// auth.d.ts
declare function verifyPassword(
  plainPassword: string, 
  hashedPassword: string): Promise<boolean>;
  
declare function hashPassword(
  password: string): Promise<string>;

export { verifyPassword, hashPassword };
