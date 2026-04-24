import {
  ACTIVATE_ACCOUNT_USE_CASE_INTERFACE,
  ACTIVATION_CODE_REPOSITORY_INTERFACE,
  AUTH_SESSION_REPOSITORY_INTERFACE,
  CREATE_ACTIVATION_CODE_USE_CASE_INTERFACE,
  GET_ME_USE_CASE_INTERFACE,
  HASH_SERVICE,
  REFRESH_USE_CASE_INTERFACE,
  SIGN_IN_USE_CASE_INTERFACE,
  SIGN_OUT_USE_CASE_INTERFACE,
  SIGN_UP_USE_CASE_INTERFACE,
  UPDATE_ME_USE_CASE_INTERFACE,
} from '@src/modules/auth/application/contracts/tokens/auth.tokens';

import { ActivationCodeRepository } from '@src/modules/auth/infrastructure/repositories/activation-code.repository';
import { AuthSessionRepository } from '@src/modules/auth/infrastructure/repositories/auth-session.repository';
import { PasswordHashService } from '@src/modules/auth/infrastructure/services/password-hash.service';

import { SignUpUseCase } from '@src/modules/auth/application/use-cases/sign-up.use-case';
import { SignInUseCase } from '@src/modules/auth/application/use-cases/sign-in.use-case';
import { CreateActivationCodeUseCase } from '@src/modules/auth/application/use-cases/create-activation-code.use-case';
import { ActivateAccountUseCase } from '@src/modules/auth/application/use-cases/activate-account.use-case';
import { RefreshUseCase } from '@src/modules/auth/application/use-cases/refresh.use-case';
import { SignOutUseCase } from '@src/modules/auth/application/use-cases/sign-out.use-case';
import { GetMeUseCase } from '@src/modules/auth/application/use-cases/get-me.use-case';
import { UpdateMeUseCase } from '@src/modules/auth/application/use-cases/update-me.use-case';

export const authProviders = [
  {
    provide: ACTIVATION_CODE_REPOSITORY_INTERFACE,
    useClass: ActivationCodeRepository,
  },
  {
    provide: AUTH_SESSION_REPOSITORY_INTERFACE,
    useClass: AuthSessionRepository,
  },
  {
    provide: CREATE_ACTIVATION_CODE_USE_CASE_INTERFACE,
    useClass: CreateActivationCodeUseCase,
  },
  {
    provide: HASH_SERVICE,
    useClass: PasswordHashService,
  },
  {
    provide: SIGN_UP_USE_CASE_INTERFACE,
    useClass: SignUpUseCase,
  },
  {
    provide: SIGN_IN_USE_CASE_INTERFACE,
    useClass: SignInUseCase,
  },
  {
    provide: ACTIVATE_ACCOUNT_USE_CASE_INTERFACE,
    useClass: ActivateAccountUseCase,
  },
  {
    provide: REFRESH_USE_CASE_INTERFACE,
    useClass: RefreshUseCase,
  },
  {
    provide: SIGN_OUT_USE_CASE_INTERFACE,
    useClass: SignOutUseCase,
  },
  {
    provide: GET_ME_USE_CASE_INTERFACE,
    useClass: GetMeUseCase,
  },
  {
    provide: UPDATE_ME_USE_CASE_INTERFACE,
    useClass: UpdateMeUseCase,
  },
];
