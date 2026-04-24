import {
  MATCH_REPOSITORY_INTERFACE,
  LIST_MATCH_USE_CASE_INTERFACE,
  CREATE_MATCH_USE_CASE_INTERFACE,
  READ_MATCH_USE_CASE_INTERFACE,
  UPDATE_MATCH_USE_CASE_INTERFACE,
  DELETE_MATCH_USE_CASE_INTERFACE,
} from '@src/modules/match/application/contracts/tokens/match.tokens';

import { MatchRepository } from '@src/modules/match/infrastructure/repositories/match.repository';

import { ListMatchUseCase } from '@src/modules/match/application/use-cases/list-match.use-case';
import { CreateMatchUseCase } from '@src/modules/match/application/use-cases/create-match.use-case';
import { ReadMatchUseCase } from '@src/modules/match/application/use-cases/read-match.use-case';
import { UpdateMatchUseCase } from '@src/modules/match/application/use-cases/update-match.use-case';
import { DeleteMatchUseCase } from '@src/modules/match/application/use-cases/delete-match.use-case';

export const matchProviders = [
  {
    provide: MATCH_REPOSITORY_INTERFACE,
    useClass: MatchRepository,
  },
  {
    provide: LIST_MATCH_USE_CASE_INTERFACE,
    useClass: ListMatchUseCase,
  },
  {
    provide: CREATE_MATCH_USE_CASE_INTERFACE,
    useClass: CreateMatchUseCase,
  },
  {
    provide: READ_MATCH_USE_CASE_INTERFACE,
    useClass: ReadMatchUseCase,
  },
  {
    provide: UPDATE_MATCH_USE_CASE_INTERFACE,
    useClass: UpdateMatchUseCase,
  },
  {
    provide: DELETE_MATCH_USE_CASE_INTERFACE,
    useClass: DeleteMatchUseCase,
  },
];
