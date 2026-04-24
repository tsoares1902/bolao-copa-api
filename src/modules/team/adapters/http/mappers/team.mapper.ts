import { TeamOutput } from '@src/modules/team/application/dto/output/team.output';
import { TeamResponse } from '@src/modules/team/adapters/http/dto/response/team.response';

export class TeamMapper {
  static toResponse(output: TeamOutput): TeamResponse {
    return {
      _id: output._id,
      name: output.name,
      isoCode: output.isoCode,
      flagEmoji: output.flagEmoji,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
    };
  }

  static toResponseList(outputs: TeamOutput[]): TeamResponse[] {
    return outputs.map((output) => this.toResponse(output));
  }
}
