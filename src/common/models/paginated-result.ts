export class PaginatedResult<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: T[];

  constructor(
    items: T[],
    count: number,
    pageNumber: number,
    pageSize: number,
  ) {
    this.totalCount = count;
    this.pageSize = pageSize;
    this.currentPage = pageNumber;
    this.totalPages = Math.ceil(count / pageSize);
    this.items = items;
    this.hasPrevious = pageNumber > 1;
    this.hasNext = pageNumber < this.totalPages;
  }

  static async fromQuery<T>(
    queryBuilder: any, // TypeORM QueryBuilder hoặc repository query
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginatedResult<T>> {
    const [items, count] = await queryBuilder
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return new PaginatedResult<T>(
      items,
      count,
      pageNumber,
      pageSize,
    );
  }
}
