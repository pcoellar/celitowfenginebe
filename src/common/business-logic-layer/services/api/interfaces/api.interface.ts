export abstract class IApiService {
  abstract get(url: string): Promise<any>;
  abstract post(url: string, body: any): Promise<any>;
  abstract put(url: string, body: any): Promise<any>;
  abstract delete(url: string): void;
}
