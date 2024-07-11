export abstract class IApiService {
  abstract get(url: string): Promise<any>;
  abstract post(url: string, body: any): Promise<any>;
}
