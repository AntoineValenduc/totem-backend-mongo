import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { join } from 'path';
import { existsSync } from 'fs';

import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { Profile, ProfileSchema } from './schema/profile.schema';

import { Branch, BranchSchema } from './schema/branch.schema';
import { BranchController } from './controllers/branch.controller';
import { BranchService } from './services/branch.service';

import { Badge, BadgeSchema } from './schema/badge.schema';
import { BadgeController } from './controllers/badge.controller';
import { BadgeService } from './services/badge.service';

const env = process.env.NODE_ENV || 'development';

// Construction du chemin vers le fichier .env selon NODE_ENV
const envFilePath = join(process.cwd(), `.env.${env}`);
// Vérifie si le fichier existe, sinon fallback sur .env simple
const fallbackEnvFilePath = join(process.cwd(), '.env');
const resolvedEnvFilePath = existsSync(envFilePath) ? envFilePath : fallbackEnvFilePath;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolvedEnvFilePath,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        MONGO_URI: Joi.string().uri().required(),
        JWT_SECRET: Joi.string().min(8).required(),
        JWT_EXPIRES_IN: Joi.string().default('3600s'),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/totemDB'),
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Badge.name, schema: BadgeSchema },
    ]),
  ],
  controllers: [ProfileController, BranchController, BadgeController],
  providers: [ProfileService, BranchService, BadgeService],
})
export class TotemMongoModule {}
