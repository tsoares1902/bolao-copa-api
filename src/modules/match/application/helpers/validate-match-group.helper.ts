import { BadRequestException } from '@nestjs/common';

import { MatchGroup } from '@src/modules/match/domain/enums/match-group.enum';
import { MatchPhase } from '@src/modules/match/domain/enums/match-phase.enum';

type ValidateMatchGroupParams = {
  phase?: MatchPhase;
  groupName?: MatchGroup;
};

export function validateMatchGroup({
  phase,
  groupName,
}: ValidateMatchGroupParams): void {
  if (phase !== MatchPhase.GROUP_STAGE && groupName) {
    throw new BadRequestException(
      'Grupo só é permitido para jogos da Fase de Grupos',
    );
  }
}
