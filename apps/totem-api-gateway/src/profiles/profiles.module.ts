import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BranchesService } from '../branches/branches.service';
import { BranchesController } from '../branches/branches.controller';
import { BadgesController } from '../badges/badges.controller';
import { BadgesService } from '../badges/badges.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TOTEM_MONGO_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
  providers: [ProfilesService, BranchesService, BadgesService],
  controllers: [ProfilesController, BranchesController, BadgesController],
})
export class ProfilesModule {}
