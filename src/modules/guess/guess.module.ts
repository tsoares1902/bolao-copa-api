import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  GuessSchema,
  GuessSchemaFactory,
} from '@src/modules/guess/infrastructure/database/mongoose/schemas/guess.schema';

import { guessProviders } from '@src/modules/guess/infrastructure/providers/guess.providers';

import { AuthModule } from '@src/modules/auth/auth.module';
import { UserModule } from '@src/modules/user/user.module';
import { MatchModule } from '@src/modules/match/match.module';

import { CreateGuessController } from '@src/modules/guess/adapters/http/controllers/create-guess.controller';
import { ListGuessController } from '@src/modules/guess/adapters/http/controllers/list-guess.controller';
import { ListMyGuessController } from '@src/modules/guess/adapters/http/controllers/list-my-guess.controller';
import { ReadGuessController } from '@src/modules/guess/adapters/http/controllers/read-guess.controller';
import { ListGuessByMatchController } from '@src/modules/guess/adapters/http/controllers/list-guess-by-match.controller';
import { UpdateGuessController } from '@src/modules/guess/adapters/http/controllers/update-guess.controller';
import { DeleteGuessController } from '@src/modules/guess/adapters/http/controllers/delete-guess.controller';
import { CalculateGuessPointsController } from '@src/modules/guess/adapters/http/controllers/calculate-guess-points.controller';

const controllers = [
  CreateGuessController,
  ListGuessController,
  ListMyGuessController,
  ReadGuessController,
  ListGuessByMatchController,
  UpdateGuessController,
  DeleteGuessController,
  CalculateGuessPointsController,
];

@Module({
  imports: [
    AuthModule,
    UserModule,
    MatchModule,
    MongooseModule.forFeature([
      {
        name: GuessSchema.name,
        schema: GuessSchemaFactory,
      },
    ]),
  ],
  controllers,
  providers: [...guessProviders],
  exports: [...guessProviders],
})
export class GuessModule {}
