import { DeleteTeamInput } from '@src/modules/team/application/dto/input/delete-team.input';

export interface DeleteTeamUseCaseInterface {
  execute(input: DeleteTeamInput): Promise<void>;
}
