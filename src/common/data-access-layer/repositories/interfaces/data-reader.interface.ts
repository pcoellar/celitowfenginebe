export interface IDataReaderService<T> {
  findAll(): Promise<T[]>;
  findByFilter(filter: any): Promise<T[]>;
  find(id: string): Promise<T>;
}
