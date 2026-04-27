import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  GuessSchema,
  GuessSchemaFactory,
} from '@src/modules/guess/infrastructure/database/mongoose/schemas/guess.schema';

import { AuthModule } from '@src/modules/auth/auth.module';
import { GuessModule } from '@src/modules/guess/guess.module';

import { rankingProviders } from '@src/modules/ranking/infrastructure/providers/ranking.providers';
import { ListRankingController } from '@src/modules/ranking/adapters/http/controllers/list-ranking.controller';

const controllers = [ListRankingController];

@Module({
  imports: [
    AuthModule,
    GuessModule,
    MongooseModule.forFeature([
      {
        name: GuessSchema.name,
        schema: GuessSchemaFactory,
      },
    ]),
  ],
  controllers,
  providers: [...rankingProviders],
  exports: [...rankingProviders],
})
export class RankingModule {}
