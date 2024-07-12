export interface IDataReaderService<T> {
  findAll(relations?: string[]): Promise<T[]>;
  findByFilter(filter: any, relations?: string[]): Promise<T[]>;
  find(id: string, relations?: string[]): Promise<T>;
}
