import {
  USER_REPOSITORY_INTERFACE,
  CREATE_USER_USE_CASE_INTERFACE,
  DELETE_USER_USE_CASE_INTERFACE,
  LIST_USER_USE_CASE_INTERFACE,
  READ_USER_USE_CASE_INTERFACE,
  UPDATE_USER_USE_CASE_INTERFACE,
} from '@src/modules/user/application/contracts/tokens/user.tokens';

import { UserRepository } from '@src/modules/user/infrastructure/repositories/user.repository';
import { ListUserUseCase } from '@src/modules/user/application/use-cases/list-user.use-case';
import { CreateUserUseCase } from '@src/modules/user/application/use-cases/create-user.use-case';
import { ReadUserUseCase } from '@src/modules/user/application/use-cases/read-user.use-case';
import { UpdateUserUseCase } from '@src/modules/user/application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '@src/modules/user/application/use-cases/delete-user.use-case';

export const userProviders = [
  {
    provide: USER_REPOSITORY_INTERFACE,
    useClass: UserRepository,
  },
  {
    provide: LIST_USER_USE_CASE_INTERFACE,
    useClass: ListUserUseCase,
  },
  {
    provide: CREATE_USER_USE_CASE_INTERFACE,
    useClass: CreateUserUseCase,
  },
  {
    provide: READ_USER_USE_CASE_INTERFACE,
    useClass: ReadUserUseCase,
  },
  {
    provide: UPDATE_USER_USE_CASE_INTERFACE,
    useClass: UpdateUserUseCase,
  },
  {
    provide: DELETE_USER_USE_CASE_INTERFACE,
    useClass: DeleteUserUseCase,
  },
];
