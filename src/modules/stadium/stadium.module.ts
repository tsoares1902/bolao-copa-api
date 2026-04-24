import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  StadiumSchema,
  StadiumSchemaFactory,
} from '@src/modules/stadium/infrastructure/database/mongoose/schemas/stadium.schema';

import { stadiumProviders } from '@src/modules/stadium/infrastructure/providers/stadium.providers';

import { ListStadiumController } from '@src/modules/stadium/adapters/http/controllers/list-stadium.controller';
import { CreateStadiumController } from '@src/modules/stadium/adapters/http/controllers/create-stadium.controller';
import { ReadStadiumController } from '@src/modules/stadium/adapters/http/controllers/read-stadium.controller';
import { UpdateStadiumController } from '@src/modules/stadium/adapters/http/controllers/update-stadium.controller';
import { DeleteStadiumController } from '@src/modules/stadium/adapters/http/controllers/delete-stadium.controller';

const controllers = [
  ListStadiumController,
  CreateStadiumController,
  ReadStadiumController,
  UpdateStadiumController,
  DeleteStadiumController,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: StadiumSchema.name,
        schema: StadiumSchemaFactory,
      },
    ]),
  ],
  controllers,
  providers: [...stadiumProviders],
  exports: [...stadiumProviders],
})
export class StadiumModule {}
