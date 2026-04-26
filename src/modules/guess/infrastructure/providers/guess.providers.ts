import {
  CALCULATE_GUESS_POINTS_USE_CASE_INTERFACE,
  CREATE_GUESS_USE_CASE_INTERFACE,
  DELETE_GUESS_USE_CASE_INTERFACE,
  GUESS_REPOSITORY_INTERFACE,
  LIST_GUESS_BY_MATCH_USE_CASE_INTERFACE,
  LIST_GUESS_USE_CASE_INTERFACE,
  LIST_MY_GUESS_USE_CASE_INTERFACE,
  READ_GUESS_USE_CASE_INTERFACE,
  UPDATE_GUESS_USE_CASE_INTERFACE,
} from '@src/modules/guess/application/contracts/tokens/guess.tokens';

import { GuessRepository } from '@src/modules/guess/infrastructure/repositories/guess.repository';

import { ListGuessUseCase } from '@src/modules/guess/application/use-cases/list-guess.use-case';
import { CreateGuessUseCase } from '@src/modules/guess/application/use-cases/create-guess.use-case';
import { ReadGuessUseCase } from '@src/modules/guess/application/use-cases/read-guess.use-case';
import { ListMyGuessUseCase } from '@src/modules/guess/application/use-cases/list-my-guess.use-case';
import { ListGuessByMatchUseCase } from '@src/modules/guess/application/use-cases/list-guess-by-match.use-case';
import { UpdateGuessUseCase } from '@src/modules/guess/application/use-cases/update-guess.use-case';
import { DeleteGuessUseCase } from '@src/modules/guess/application/use-cases/delete-guess.use-case';
import { CalculateGuessPointsUseCase } from '@src/modules/guess/application/use-cases/calculate-guess-points.use-case';

export const guessProviders = [
  {
    provide: GUESS_REPOSITORY_INTERFACE,
    useClass: GuessRepository,
  },
  {
    provide: LIST_GUESS_USE_CASE_INTERFACE,
    useClass: ListGuessUseCase,
  },
  {
    provide: CREATE_GUESS_USE_CASE_INTERFACE,
    useClass: CreateGuessUseCase,
  },
  {
    provide: READ_GUESS_USE_CASE_INTERFACE,
    useClass: ReadGuessUseCase,
  },
  {
    provide: LIST_MY_GUESS_USE_CASE_INTERFACE,
    useClass: ListMyGuessUseCase,
  },
  {
    provide: LIST_GUESS_BY_MATCH_USE_CASE_INTERFACE,
    useClass: ListGuessByMatchUseCase,
  },
  {
    provide: UPDATE_GUESS_USE_CASE_INTERFACE,
    useClass: UpdateGuessUseCase,
  },
  {
    provide: DELETE_GUESS_USE_CASE_INTERFACE,
    useClass: DeleteGuessUseCase,
  },
  {
    provide: CALCULATE_GUESS_POINTS_USE_CASE_INTERFACE,
    useClass: CalculateGuessPointsUseCase,
  },
];
