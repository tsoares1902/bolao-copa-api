import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import apiConfig from '@src/shared/infrastructure/config/api.config';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckModule } from '@src/modules/health-check/health-check.module';
import { AuthModule } from '@src/modules/auth/auth.module';
import { UserModule } from '@src/modules/user/user.module';
import { TeamModule } from '@src/modules/team/team.module';
import { StadiumModule } from '@src/modules/stadium/stadium.module';
import { MatchModule } from '@src/modules/match/match.module';
import { GuessModule } from '@src/modules/guess/guess.module';
import { RankingModule } from '@src/modules/ranking/ranking.module';

const databaseUri = process.env.DATABASE_URI;
const importedModules = [
  HealthCheckModule,
  AuthModule,
  UserModule,
  TeamModule,
  StadiumModule,
  MatchModule,
  GuessModule,
  RankingModule,
];
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [apiConfig],
      isGlobal: true,
    }),
    ...(databaseUri
      ? [
          MongooseModule.forRoot(databaseUri, {
            dbName: process.env.DATABASE_NAME,
          }),
        ]
      : []),
    ...importedModules,
  ],
})
export class AppModule {}
