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


@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        TCP_HOST: Joi.string().hostname().required(),
        TCP_PORT: Joi.number().port().required(),
        /*KAFKA_BROKER: Joi.string().uri().required(),
        KAFKA_CLIENT_ID: Joi.string().required(),
        KAFKA_GROUP_ID: Joi.string().required(),*/
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
      /*{
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [configService.getOrThrow<string>('KAFKA_BROKER')],
              clientId: configService.getOrThrow<string>('KAFKA_CLIENT_ID'),
            },
            consumer: {
              groupId: configService.getOrThrow<string>('KAFKA_GROUP_ID'),
            },
            retry: {
              initialRetryTime: 1000,
              retries: 5
            }
          }
        })
      }*/
    ])
  ],
  controllers: [
    TotemApiGatewayController,
    ProfilesController,
    BranchesController,
    BadgesController,
  ],
  providers: [
    TotemApiGatewayService,
    ProfilesService,
    BranchesService,
    BadgesService,
  ],
})
export class TotemApiGatewayModule {}