import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TotemMongoModule } from '@totem-mongo/src/totem-mongo.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [PrismaModule, TotemMongoModule, MailModule],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
