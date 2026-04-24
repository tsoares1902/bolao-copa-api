import { CreateTeamInput } from '@src/modules/team/application/dto/input/create-team.input';
import { TeamOutput } from '@src/modules/team/application/dto/output/team.output';

export interface CreateTeamUseCaseInterface {
  execute(input: CreateTeamInput): Promise<TeamOutput>;
}
