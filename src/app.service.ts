import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  appendQueriesToUrl(query: Record<string, unknown>, url: string) {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value != null) {
        queryParams.append(key, value.toString());
      }
    }
    return `${url}?${queryParams}`;
  }
}
