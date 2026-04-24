import MetadataUtils from '@src/shared/utils/metadata.utils';

describe('MetadataUtils', () => {
  let metadataUtils: MetadataUtils;

  beforeEach(() => {
    metadataUtils = new MetadataUtils();
  });

  it('deve retornar os dados de paginacao com links de anterior e proxima', () => {
    expect(metadataUtils.getPaginationData(50, 10, 10, 2, '/users')).toEqual({
      totalItems: 50,
      itemCount: 10,
      itemsPerPage: 10,
      totalPages: 5,
      currentPage: 2,
      hasNextPage: true,
      hasPreviousPage: true,
      links: {
        first: '/users?limit=10',
        previous: '/users?page=1&limit=10',
        next: '/users?page=3&limit=10',
        last: '/users?page=5&limit=10',
      },
    });
  });

  it('deve retornar links vazios de anterior e proxima nas paginas de borda', () => {
    expect(metadataUtils.getPaginationData(5, 5, 10, 1, '/users')).toEqual({
      totalItems: 5,
      itemCount: 5,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      links: {
        first: '/users?limit=10',
        previous: '',
        next: '',
        last: '/users?page=1&limit=10',
      },
    });
  });
});
