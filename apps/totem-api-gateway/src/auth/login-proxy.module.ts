import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthProxyController } from './login-proxy.controller';
import { JwtSharedModule } from '@totem-auth-sql/src/libs/shared/jwt/jwt.module';

@Module({
  imports: [HttpModule, JwtSharedModule],
  controllers: [AuthProxyController],
})
export class AuthGatewayModule {}
