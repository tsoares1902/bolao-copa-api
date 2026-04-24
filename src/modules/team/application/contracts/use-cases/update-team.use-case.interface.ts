import { UpdateTeamInput } from '@src/modules/team/application/dto/input/update-team.input';
import { TeamOutput } from '@src/modules/team/application/dto/output/team.output';

export interface UpdateTeamUseCaseInterface {
  execute(input: UpdateTeamInput): Promise<TeamOutput>;
}
