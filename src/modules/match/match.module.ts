import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  MatchSchema,
  MatchSchemaFactory,
} from '@src/modules/match/infrastructure/database/mongoose/schemas/match.schema';

import { matchProviders } from '@src/modules/match/infrastructure/providers/match.providers';

import { ListMatchController } from '@src/modules/match/adapters/http/controllers/list-match.controller';
import { CreateMatchController } from '@src/modules/match/adapters/http/controllers/create-match.controller';
import { ReadMatchController } from '@src/modules/match/adapters/http/controllers/read-match.controller';
import { UpdateMatchController } from '@src/modules/match/adapters/http/controllers/update-match.controller';
import { DeleteMatchController } from '@src/modules/match/adapters/http/controllers/delete-match.controller';

import { TeamModule } from '@src/modules/team/team.module';

const controllers = [
  ListMatchController,
  CreateMatchController,
  ReadMatchController,
  UpdateMatchController,
  DeleteMatchController,
];

@Module({
  imports: [
    TeamModule,
    MongooseModule.forFeature([
      {
        name: MatchSchema.name,
        schema: MatchSchemaFactory,
      },
    ]),
  ],
  controllers,
  providers: [...matchProviders],
  exports: [...matchProviders],
})
export class MatchModule {}
