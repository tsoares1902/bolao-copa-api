import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  UserSchema,
  UserSchemaFactory,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import { userProviders } from '@src/modules/user/infrastructure/providers/user.providers';
import { ListUserController } from '@src/modules/user/adapters/http/controllers/list-user.controller';
import { CreateUserController } from '@src/modules/user/adapters/http/controllers/create-user.controller';
import { ReadUserController } from '@src/modules/user/adapters/http/controllers/read-user.controller';
import { UpdateUserController } from '@src/modules/user/adapters/http/controllers/update-user.controller';
import { DeleteUserController } from '@src/modules/user/adapters/http/controllers/delete-user.controller';

const controllers = [
  ListUserController,
  CreateUserController,
  ReadUserController,
  UpdateUserController,
  DeleteUserController,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserSchema.name,
        schema: UserSchemaFactory,
      },
    ]),
  ],
  controllers,
  providers: [...userProviders],
  exports: [...userProviders],
})
export class UserModule {}
