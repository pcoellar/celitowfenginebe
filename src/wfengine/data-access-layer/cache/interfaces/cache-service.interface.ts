export abstract class ICacheService {
  abstract createClient(): any;
  abstract connect(cacheClient: any): any;
  abstract set(cacheClient: any, key: string, value: string);
  abstract get(cacheClient: any, key: string): Promise<string>;
  abstract disconnect(cacheClient: any): any;
}
