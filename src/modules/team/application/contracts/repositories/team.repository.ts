import { TeamEntity } from '@src/modules/team/domain/entities/team.entity';
import { CreateTeamInput } from '@src/modules/team/application/dto/input/create-team.input';
import { UpdateTeamInput } from '@src/modules/team/application/dto/input/update-team.input';

export interface TeamRepositoryInterface {
  list(): Promise<TeamEntity[]>;
  create(input: CreateTeamInput): Promise<TeamEntity>;
  read(_id: string): Promise<TeamEntity | null>;
  update(input: UpdateTeamInput): Promise<TeamEntity | null>;
  delete(_id: string): Promise<void>;
}
