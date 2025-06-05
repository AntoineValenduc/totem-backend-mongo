import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

// Cette fonction récupère manuellement JWT_SECRET
const getJwtSecret = (): string => {
  const config = new ConfigService();
  const secret = config.get<string>('JWT_SECRET');
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return secret;
};

export const Authenticated = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = context.switchToRpc();
    const payload = ctx.getData();

    const token = payload?.token;
    if (!token) {
      throw new RpcException('Token manquant dans le payload');
    }

    try {
      const decoded = verify(token, getJwtSecret());
      return decoded;
    } catch (err) {
      throw new RpcException('Token invalide');
    }
  },
);
