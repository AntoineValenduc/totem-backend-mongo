import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthProxyController } from './login-proxy.controller';
import { JwtSharedModule } from '../../../totem-auth-sql/src/libs/shared/jwt/jwt.module';
import { ProfilesService } from '../profiles/profiles.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    HttpModule,
    JwtSharedModule,
    ClientsModule.register([
      {
        name: 'TOTEM_MONGO_CLIENT',
        transport: Transport.TCP,
        options: {
          host: process.env.TCP_HOST ?? 'localhost',
          port: parseInt(process.env.TCP_PORT ?? '3001', 10),
        },
      },
    ]),
  ],
  controllers: [AuthProxyController],
  providers: [ProfilesService],
})
export class AuthGatewayModule {}
