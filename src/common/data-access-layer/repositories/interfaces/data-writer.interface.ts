export interface IDataWriterService<T> {
  create(entity: T): Promise<T>;
  update(entity: Partial<T>): Promise<T>;
}
