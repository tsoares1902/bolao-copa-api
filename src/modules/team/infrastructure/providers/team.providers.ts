import {
  CREATE_TEAM_USE_CASE_INTERFACE,
  DELETE_TEAM_USE_CASE_INTERFACE,
  LIST_TEAM_USE_CASE_INTERFACE,
  READ_TEAM_USE_CASE_INTERFACE,
  TEAM_REPOSITORY_INTERFACE,
  UPDATE_TEAM_USE_CASE_INTERFACE,
} from '@src/modules/team/application/contracts/tokens/team.tokens';

import { TeamRepository } from '@src/modules/team/infrastructure/repositories/team.repository';

import { ListTeamUseCase } from '@src/modules/team/application/use-cases/list-team.use-case';
import { CreateTeamUseCase } from '@src/modules/team/application/use-cases/create-team.use-case';
import { ReadTeamUseCase } from '@src/modules/team/application/use-cases/read-team.use-case';
import { UpdateTeamUseCase } from '@src/modules/team/application/use-cases/update-team.use-case';
import { DeleteTeamUseCase } from '@src/modules/team/application/use-cases/delete-team.use-case';

export const teamProviders = [
  {
    provide: TEAM_REPOSITORY_INTERFACE,
    useClass: TeamRepository,
  },
  {
    provide: LIST_TEAM_USE_CASE_INTERFACE,
    useClass: ListTeamUseCase,
  },
  {
    provide: CREATE_TEAM_USE_CASE_INTERFACE,
    useClass: CreateTeamUseCase,
  },
  {
    provide: READ_TEAM_USE_CASE_INTERFACE,
    useClass: ReadTeamUseCase,
  },
  {
    provide: UPDATE_TEAM_USE_CASE_INTERFACE,
    useClass: UpdateTeamUseCase,
  },
  {
    provide: DELETE_TEAM_USE_CASE_INTERFACE,
    useClass: DeleteTeamUseCase,
  },
];
