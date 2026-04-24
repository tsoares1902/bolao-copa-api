import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '@src/modules/user/user.module';

import {
  ActivationCodeSchema,
  ActivationCodeSchemaFactory,
} from '@src/modules/auth/infrastructure/database/mongoose/schemas/activation-code.schema';
import {
  AuthSessionSchema,
  AuthSessionSchemaFactory,
} from '@src/modules/auth/infrastructure/database/mongoose/schemas/auth-session.schema';

import { authProviders } from '@src/modules/auth/infrastructure/providers/auth.providers';

import { SignUpController } from '@src/modules/auth/adapters/http/controllers/sign-up.controller';
import { SignInController } from '@src/modules/auth/adapters/http/controllers/sign-in.controller';
import { GetMeController } from '@src/modules/auth/adapters/http/controllers/get-me.controller';
import { UpdateMeController } from '@src/modules/auth/adapters/http/controllers/update-me.controller';
import { ActivationCodeController } from '@src/modules/auth/adapters/http/controllers/activation-code.controller';
import { ActivateAccountController } from '@src/modules/auth/adapters/http/controllers/activate-account.controller';
import { RefreshController } from '@src/modules/auth/adapters/http/controllers/refresh.controller';
import { SignOutController } from '@src/modules/auth/adapters/http/controllers/sign-out.controller';

const controllers = [
  SignUpController,
  SignInController,
  GetMeController,
  UpdateMeController,
  ActivationCodeController,
  ActivateAccountController,
  RefreshController,
  SignOutController,
];

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret',
      signOptions: {
        expiresIn: '15m',
      },
    }),
    MongooseModule.forFeature([
      {
        name: ActivationCodeSchema.name,
        schema: ActivationCodeSchemaFactory,
      },
      {
        name: AuthSessionSchema.name,
        schema: AuthSessionSchemaFactory,
      },
    ]),
  ],
  controllers,
  providers: [...authProviders],
  exports: [...authProviders, JwtModule],
})
export class AuthModule {}
