import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { InvitationsModule } from './invitations/invitations.module';
import { TotemMongoModule } from '../../totem-mongo/src/totem-mongo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.development', isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'admin',
        database: process.env.POSTGRES_DB || 'postgres',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    AuthModule,
    InvitationsModule,
    TotemMongoModule
  ],
  controllers: [],
  providers: [],
})
export class TotemAuthSqlModule {}
