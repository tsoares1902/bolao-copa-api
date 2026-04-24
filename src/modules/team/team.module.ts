import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  TeamSchema,
  TeamSchemaFactory,
} from '@src/modules/team/infrastructure/database/mongoose/schemas/team.schema';
import { teamProviders } from '@src/modules/team/infrastructure/providers/team.providers';

import { ListTeamController } from '@src/modules/team/adapters/http/controllers/list-team.controller';
import { CreateTeamController } from '@src/modules/team/adapters/http/controllers/create-team.controller';
import { ReadTeamController } from '@src/modules/team/adapters/http/controllers/read-team.controller';
import { UpdateTeamController } from '@src/modules/team/adapters/http/controllers/update-team.controller';
import { DeleteTeamController } from '@src/modules/team/adapters/http/controllers/delete-team.controller';

const controllers = [
  ListTeamController,
  CreateTeamController,
  ReadTeamController,
  UpdateTeamController,
  DeleteTeamController,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TeamSchema.name,
        schema: TeamSchemaFactory,
      },
    ]),
  ],
  controllers,
  providers: [...teamProviders],
  exports: [...teamProviders],
})
export class TeamModule {}
