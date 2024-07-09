export abstract class IApiService {
  abstract get(url: string): Promise<any>;
}
