import { BadRequestException } from '@nestjs/common';

import { TeamRepositoryInterface } from '@src/modules/team/application/contracts/repositories/team.repository.interface';

type ValidateMatchTeamsParams = {
  homeTeamId: string;
  awayTeamId: string;
  teamRepository: TeamRepositoryInterface;
};

export async function validateMatchTeams({
  homeTeamId,
  awayTeamId,
  teamRepository,
}: ValidateMatchTeamsParams): Promise<void> {
  if (homeTeamId === awayTeamId) {
    throw new BadRequestException('Home team and away team must be different!');
  }

  const [homeTeam, awayTeam] = await Promise.all([
    teamRepository.read(homeTeamId),
    teamRepository.read(awayTeamId),
  ]);

  if (!homeTeam || !awayTeam) {
    throw new BadRequestException('Home team or away team is invalid!');
  }
}
