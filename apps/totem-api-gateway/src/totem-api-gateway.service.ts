import { Injectable } from '@nestjs/common';

@Injectable()
export class TotemApiGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
