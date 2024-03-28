import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import appConfig from 'src/config/app.config';
import { DatabaseService } from 'src/database/database.service';
import { AuthUserEnum } from 'src/enums/auth.enum';
import { FastifyRequest } from 'fastify';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(
    @Inject(appConfig.KEY)
    private applicationConfig: ConfigType<typeof appConfig>,
    @Inject(DatabaseService) private readonly dbService: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: applicationConfig.jwt_secret,
    });
  }

  async validate(payload: any) {
    try {
      return payload;
    } catch {
      throw new ForbiddenException('Auth validation failure');
    }
  }
}
