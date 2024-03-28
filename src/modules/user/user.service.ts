import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { GetUserEmailPasswordDto } from './get-user-email-password.dto';
import { AuthUserEnum } from 'src/enums/auth.enum';

@Injectable()
export class UserService {
  constructor(
    @Inject(DatabaseService) private readonly dbService: DatabaseService,
  ) {}

  async insertUser(createUserDto: CreateUserDto) {
    try {
      const insertUser = await this.dbService.executeQuery(
        'SELECT * FROM fd_insert_user($1, $2, $3, $4)',
        [
          createUserDto.firstName,
          createUserDto.lastName,
          createUserDto.userMobileNo,
          createUserDto.userCountryCode,
        ],
      );
      if (insertUser.length && insertUser[0].status == 1)
        return insertUser[0];
      throw new HttpException('Failed to add admin', HttpStatus.INTERNAL_SERVER_ERROR);
    } catch (error) {
      throw new HttpException(
        'Failed to add admin',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById(userId: string, userMobile: string) {
    try {
      const getUser = await this.dbService.executeQuery(
        'SELECT * FROM fd_get_user_by_id($1, $2, $3)',
        [userId, userMobile],
      );
      if (getUser.length) return getUser[0];
      throw new UnauthorizedException('User not found');
    } catch (error) {
      throw new HttpException(
        'Failed to get user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
