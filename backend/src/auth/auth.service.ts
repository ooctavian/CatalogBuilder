import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    return await this.usersService.validate(email, password);
  }

  async register(email: string, password: string) {
    const user = await this.usersService.save({ email, password } as User);
    return await this.login(user);
  }

  //async refresh(token: string) {}

  async getAccessToken(user: User): Promise<string> {
    return await this.jwtService.signAsync(
      {
        sub: user.uuid,
        email: user.email,
      },
      {
        expiresIn: '1h',
      },
    );
  }

  async getRefreshToken(user: User): Promise<string> {
    return await this.jwtService.signAsync(
      {
        email: user.email,
        sub: user.uuid,
      },
      {
        expiresIn: '7d',
      },
    );
  }

  async login(user: User) {
    const accessToken = await this.getAccessToken(user);
    const refreshToken = await this.getRefreshToken(user);

    const token: Token = await this.tokenRepository.save({
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + 7)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '),
      user: {
        uuid: user.uuid,
      },
    });
    const id = token.uuid;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    return {
      tokenId: id,
      expiresAt,
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string, tokenId: string) {
    const token = await this.tokenRepository.findOne({
      where: {
        uuid: tokenId,
        refreshToken: refreshToken,
      },
      relations: ['user'],
    });
    if (!token) {
      throw new ForbiddenException();
    }
    const accessToken = await this.getAccessToken(token.user);
    refreshToken = await this.getRefreshToken(token.user);

    await this.tokenRepository.update(token.uuid, {
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + 7)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '),
    });

    const id = token.uuid;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    return {
      tokenId: id,
      expiresAt,
      accessToken,
      refreshToken,
    };
  }
}
