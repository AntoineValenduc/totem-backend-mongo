import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { TotemApiGatewayController } from './totem-api-gateway.controller';
import { TotemApiGatewayService } from './totem-api-gateway.service';
import { ProfilesService } from './profiles/profiles.service';
import { BranchesService } from './branches/branches.service';
import { BadgesService } from './badges/badges.service';
import { ProfilesController } from './profiles/profiles.controller';
import { BranchesController } from './branches/branches.controller';
import { BadgesController } from './badges/badges.controller';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { existsSync } from 'fs';
import { InvitationsProxyController } from '../src/invitations/invitation-proxy.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthProxyController } from 'totem-api-gateway/src/auth/login-proxy.controller';
import { AuthGatewayModule } from 'totem-api-gateway/src/auth/login-proxy.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtSharedModule } from '../../totem-auth-sql/src/libs/shared/jwt/jwt.module';

const env = process.env.NODE_ENV || 'development';
const envPath = join(process.cwd(), `.env.${env}`);
const fallbackPath = join(process.cwd(), `.env`);
const resolvedPath = existsSync(envPath) ? envPath : fallbackPath;
dotenv.config({ path: resolvedPath });

@Module({
  imports: [
    AuthGatewayModule,
    ConfigModule.forRoot({
      envFilePath: resolvedPath,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        TCP_HOST: Joi.string().required(),
        TCP_PORT: Joi.number().required(),
        TCP_TIMEOUT: Joi.number().default(5000)
      })
  }),

  ClientsModule.registerAsync([
      {
        name: 'TOTEM_MONGO_CLIENT',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('TCP_HOST'),
            port: configService.get<number>('TCP_PORT'),
          },
          retryAttempts: 5,
          retryDelay: 3000
        }),
        inject: [ConfigService]
      },
    ]),
    HttpModule,
    JwtSharedModule
  ],
  controllers: [
    TotemApiGatewayController,
    ProfilesController,
    BranchesController,
    BadgesController,
    InvitationsProxyController,
    AuthProxyController
  ],
  providers: [
    TotemApiGatewayService,
    ProfilesService,
    BranchesService,
    BadgesService,
  ],
})
export class TotemApiGatewayModule {}
console.log("process.env.TCP_HOST => ", process.env.TCP_HOST);