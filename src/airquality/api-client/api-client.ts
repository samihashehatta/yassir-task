import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ApiClient {
  protected host: string;

  constructor(private readonly httpService: HttpService) {}

  set _host(host: string) {
    this.host = host;
  }

  async get(uri: string): Promise<any> {
    const url = this.host + uri;
    try {
      const response = await this.httpService.axiosRef.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
