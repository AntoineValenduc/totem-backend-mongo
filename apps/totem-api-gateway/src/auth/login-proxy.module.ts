import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthProxyController } from './login-proxy.controller';

@Module({
  imports: [HttpModule],
  controllers: [AuthProxyController],
})
export class AuthGatewayModule {}
