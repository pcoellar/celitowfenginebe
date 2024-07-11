import { Injectable } from '@nestjs/common';
import { IApiService } from './interfaces/api.interface';
import axios from 'axios';

@Injectable()
export class ApiService implements IApiService {
  async get(url: string): Promise<any> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching data. Url: ' + url + ' Error:',
        error.message,
      );
      throw error;
    }
  }
  async post(url: string, body: any): Promise<any> {
    try {
      const response = await axios.post(url, body);
      return response.data;
    } catch (error) {
      console.error(
        'Error posting data. Url: ' + url + ' Error:',
        error.message,
      );
      throw error;
    }
  }
}
