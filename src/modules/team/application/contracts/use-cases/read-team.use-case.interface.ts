import { ReadTeamInput } from '@src/modules/team/application/dto/input/read-team.input';
import { TeamOutput } from '@src/modules/team/application/dto/output/team.output';

export interface ReadTeamUseCaseInterface {
  execute(input: ReadTeamInput): Promise<TeamOutput>;
}
