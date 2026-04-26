import { BadRequestException } from '@nestjs/common';

import { MatchEntity } from '@src/modules/match/domain/entities/match.entity';

export function validateMatchNotStarted(match: MatchEntity): void {
  const now = new Date();
  const matchDate = new Date(match.matchDate);

  if (matchDate <= now) {
    throw new BadRequestException(
      'Guess can only be created or updated before the match starts',
    );
  }
}
