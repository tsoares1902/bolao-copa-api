import { NotFoundException } from '@nestjs/common';

import { CreateStadiumUseCase } from '@src/modules/stadium/application/use-cases/create-stadium.use-case';
import { ReadStadiumUseCase } from '@src/modules/stadium/application/use-cases/read-stadium.use-case';
import { UpdateStadiumUseCase } from '@src/modules/stadium/application/use-cases/update-stadium.use-case';
import { DeleteStadiumUseCase } from '@src/modules/stadium/application/use-cases/delete-stadium.use-case';
import { ListStadiumUseCase } from '@src/modules/stadium/application/use-cases/list-stadium.use-case';
import type { StadiumRepositoryInterface } from '@src/modules/stadium/application/contracts/repositories/stadium.repository.interface';
import type {
  MidiaEntity,
  StadiumEntity,
} from '@src/modules/stadium/domain/entities/stadium.entity';
import type { CreateStadiumInput } from '@src/modules/stadium/application/dto/input/create-stadium.input';
import type { UpdateStadiumInput } from '@src/modules/stadium/application/dto/input/update-stadium.input';

type StadiumRepositoryMock = jest.Mocked<StadiumRepositoryInterface>;

const createRepositoryMock = (): StadiumRepositoryMock => ({
  list: jest.fn(),
  create: jest.fn(),
  read: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const createMidiaEntity = (
  overrides: Partial<MidiaEntity> = {},
): MidiaEntity => ({
  photoUrl: 'https://example.com/maracana.jpg',
  ...overrides,
});

const createStadiumEntity = (
  overrides: Partial<StadiumEntity> = {},
): StadiumEntity => ({
  _id: 'stadium-id',
  name: 'Maracana',
  city: 'Rio de Janeiro',
  capacity: 78838,
  midia: createMidiaEntity(),
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  ...overrides,
});

describe('Use Cases de Stadium', () => {
  let repository: StadiumRepositoryMock;

  beforeEach(() => {
    repository = createRepositoryMock();
  });

  describe('CreateStadiumUseCase', () => {
    let useCase: CreateStadiumUseCase;

    beforeEach(() => {
      useCase = new CreateStadiumUseCase(repository);
    });

    describe('execute', () => {
      it('deve criar um estadio retornando os dados persistidos', async () => {
        const input: CreateStadiumInput = {
          name: 'Maracana',
          city: 'Rio de Janeiro',
          capacity: 78838,
          midia: {
            photoUrl: 'https://example.com/maracana.jpg',
          },
        };
        const stadium = createStadiumEntity();

        repository.create.mockResolvedValue(stadium);

        const result = await useCase.execute(input);

        expect(repository.create).toHaveBeenCalledWith(input);
        expect(result).toEqual(stadium);
      });
    });
  });

  describe('ReadStadiumUseCase', () => {
    let useCase: ReadStadiumUseCase;

    beforeEach(() => {
      useCase = new ReadStadiumUseCase(repository);
    });

    describe('execute', () => {
      it('deve retornar um estadio quando o stadiumId existir', async () => {
        const stadium = createStadiumEntity();

        repository.read.mockResolvedValue(stadium);

        const result = await useCase.execute({ stadiumId: 'stadium-id' });

        expect(repository.read).toHaveBeenCalledWith('stadium-id');
        expect(result).toEqual(stadium);
      });

      it('deve lançar exceção quando o estadio não for encontrado', async () => {
        repository.read.mockResolvedValue(null);

        await expect(
          useCase.execute({ stadiumId: 'stadium-id' }),
        ).rejects.toThrow(new NotFoundException('Stadium not found'));
      });
    });
  });

  describe('UpdateStadiumUseCase', () => {
    let useCase: UpdateStadiumUseCase;

    beforeEach(() => {
      useCase = new UpdateStadiumUseCase(repository);
    });

    describe('execute', () => {
      it('deve atualizar um estadio com os dados informados', async () => {
        const input: UpdateStadiumInput = {
          stadiumId: 'stadium-id',
          name: 'Maracana',
          city: 'Rio de Janeiro',
          capacity: 79000,
          midia: {
            photoUrl: 'https://example.com/maracana-novo.jpg',
          },
        };
        const stadium = createStadiumEntity({
          capacity: 79000,
          midia: createMidiaEntity({
            photoUrl: 'https://example.com/maracana-novo.jpg',
          }),
        });

        repository.update.mockResolvedValue(stadium);

        const result = await useCase.execute(input);

        expect(repository.update).toHaveBeenCalledWith(input);
        expect(result).toEqual(stadium);
      });

      it('deve lançar exceção quando o estadio não for encontrado', async () => {
        repository.update.mockResolvedValue(null);

        await expect(
          useCase.execute({ stadiumId: 'stadium-id' }),
        ).rejects.toThrow(new NotFoundException('Stadium not found'));
      });
    });
  });

  describe('DeleteStadiumUseCase', () => {
    let useCase: DeleteStadiumUseCase;

    beforeEach(() => {
      useCase = new DeleteStadiumUseCase(repository);
    });

    describe('execute', () => {
      it('deve remover um estadio existente', async () => {
        repository.read.mockResolvedValue(createStadiumEntity());
        repository.delete.mockResolvedValue(undefined);

        await useCase.execute({ stadiumId: 'stadium-id' });

        expect(repository.read).toHaveBeenCalledWith('stadium-id');
        expect(repository.delete).toHaveBeenCalledWith('stadium-id');
      });

      it('deve lançar exceção quando o estadio não for encontrado', async () => {
        repository.read.mockResolvedValue(null);

        await expect(
          useCase.execute({ stadiumId: 'stadium-id' }),
        ).rejects.toThrow(new NotFoundException('Stadium not found'));
        expect(repository.delete).not.toHaveBeenCalled();
      });
    });
  });

  describe('ListStadiumUseCase', () => {
    let useCase: ListStadiumUseCase;

    beforeEach(() => {
      useCase = new ListStadiumUseCase(repository);
    });

    describe('execute', () => {
      it('deve listar os estadios retornados pelo repositório', async () => {
        const stadiums = [
          createStadiumEntity(),
          createStadiumEntity({
            _id: 'stadium-id-2',
            name: 'Mineirao',
            city: 'Belo Horizonte',
            capacity: 61927,
            midia: createMidiaEntity({
              photoUrl: 'https://example.com/mineirao.jpg',
            }),
          }),
        ];

        repository.list.mockResolvedValue(stadiums);

        const result = await useCase.execute();

        expect(repository.list).toHaveBeenCalledTimes(1);
        expect(result).toEqual(stadiums);
      });

      it('deve retornar uma lista vazia quando não existirem estadios', async () => {
        repository.list.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(repository.list).toHaveBeenCalledTimes(1);
        expect(result).toEqual([]);
      });
    });
  });
});
