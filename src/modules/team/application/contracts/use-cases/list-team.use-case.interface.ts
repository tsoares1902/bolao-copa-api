import { TeamOutput } from '@src/modules/team/application/dto/output/team.output';

export interface ListTeamUseCaseInterface {
  execute(): Promise<TeamOutput[]>;
}
