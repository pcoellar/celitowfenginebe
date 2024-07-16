export abstract class ICacheService {
  abstract set(key: string, value: string);
  abstract get(key: string): Promise<string>;
}
