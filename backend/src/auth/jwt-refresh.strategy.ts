import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.RefreshTokenSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request) {
    const refreshToken = request.header('Authorization').split(' ')[1];
    const tokenId = request.header('X-Token-Id');

    return this.authService.refresh(refreshToken, tokenId);
  }
}
