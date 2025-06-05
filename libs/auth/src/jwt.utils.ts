import * as jwt from 'jsonwebtoken';

export function verifyJwt(token: string): any {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not defined');

  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}
