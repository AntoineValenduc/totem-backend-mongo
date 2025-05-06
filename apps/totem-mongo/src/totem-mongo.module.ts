import { Module } from '@nestjs/common';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './schema/profile.schema';
import { Branch, BranchSchema } from './schema/branch.schema';
import { Badge, BadgeSchema } from './schema/badge.schema';
import { BranchController } from './controllers/branch.controller';
import { BranchService } from './services/branch.service';
import { BadgeController } from './controllers/badge.controller';
import { BadgeService } from './services/badge.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/totemDB'),
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
