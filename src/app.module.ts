import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import apiConfig from '@src/shared/infrastructure/config/api.config';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckModule } from '@src/modules/health-check/health-check.module';
import { TeamModule } from '@src/modules/team/team.module';
import { StadiumModule } from '@src/modules/stadium/stadium.module';
import { MatchModule } from '@src/modules/match/match.module';

const databaseUri = process.env.DATABASE_URI;
const importedModules = [
  HealthCheckModule,
  TeamModule,
  StadiumModule,
  MatchModule,
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
