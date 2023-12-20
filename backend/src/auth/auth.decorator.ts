import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtConstants } from './constants';
import * as jwt from 'jsonwebtoken';

class InvalidToken extends HttpException {
  message: string;
  name: string;
}

export const Authorization = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = request.headers['authorization'];
    if (!accessToken) {
      throw new UnauthorizedException('Missing authorization token');
    }

    const [bearer, token] = accessToken.split(' ');

    if (bearer !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization token type');
    }

    try {
      const decoded = jwt.verify(token, jwtConstants.AccessTokenSecret);
      if (!decoded.sub) {
        throw new Error();
      }
      return decoded.sub;
    } catch (ex) {
      throw new InvalidToken('Invalid Token', 400);
    }
  },
);

export interface AuthUser {
  userId: string;
}
