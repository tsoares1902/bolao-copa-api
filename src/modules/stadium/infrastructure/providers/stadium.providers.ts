import {
  STADIUM_REPOSITORY_INTERFACE,
  LIST_STADIUM_USE_CASE_INTERFACE,
  CREATE_STADIUM_USE_CASE_INTERFACE,
  READ_STADIUM_USE_CASE_INTERFACE,
  UPDATE_STADIUM_USE_CASE_INTERFACE,
  DELETE_STADIUM_USE_CASE_INTERFACE,
} from '@src/modules/stadium/application/contracts/tokens/stadium.tokens';
import { StadiumRepository } from '@src/modules/stadium/infrastructure/repositories/stadium.repository';
import { ListStadiumUseCase } from '@src/modules/stadium/application/use-cases/list-stadium.use-case';
import { CreateStadiumUseCase } from '@src/modules/stadium/application/use-cases/create-stadium.use-case';
import { ReadStadiumUseCase } from '@src/modules/stadium/application/use-cases/read-stadium.use-case';
import { UpdateStadiumUseCase } from '@src/modules/stadium/application/use-cases/update-stadium.use-case';
import { DeleteStadiumUseCase } from '@src/modules/stadium/application/use-cases/delete-stadium.use-case';

export const stadiumProviders = [
  {
    provide: STADIUM_REPOSITORY_INTERFACE,
    useClass: StadiumRepository,
  },
  {
    provide: LIST_STADIUM_USE_CASE_INTERFACE,
    useClass: ListStadiumUseCase,
  },
  {
    provide: CREATE_STADIUM_USE_CASE_INTERFACE,
    useClass: CreateStadiumUseCase,
  },
  {
    provide: READ_STADIUM_USE_CASE_INTERFACE,
    useClass: ReadStadiumUseCase,
  },
  {
    provide: UPDATE_STADIUM_USE_CASE_INTERFACE,
    useClass: UpdateStadiumUseCase,
  },
  {
    provide: DELETE_STADIUM_USE_CASE_INTERFACE,
    useClass: DeleteStadiumUseCase,
  },
];
