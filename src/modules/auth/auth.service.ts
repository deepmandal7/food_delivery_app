import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import SmsService from './sms.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(SmsService) private readonly smsService: SmsService,
  ) {}

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ verified: boolean } | string | { status: number; msg: string }> {
    try {
      // Confirm the provided phone number
      await this.smsService.verifyOtp(
        signUpDto,
      );

      // Insert new user
      await this.userService.insertUser(signUpDto);

      // Generate and return a new authentication token
      const token = await this.getToken(null, {
        usercountrycode: signUpDto.userCountryCode,
        usermobileno: signUpDto.userMobileNo,
      });

      // Return the authentication token
      return token;
    } catch (error) {
      // Handle specific error case for wrong code provided during confirmation
      if (error.response.error == 'UnauthorizedException: Wrong code provided')
      throw new UnauthorizedException('Wrong code provided');
      if (error.response.error == 'HttpException: Failed to add user')
      throw new HttpException('Failed to add user', HttpStatus.INTERNAL_SERVER_ERROR);
      if (error.response.error == 'UnauthorizedException: User not found')
      throw new UnauthorizedException('User not found');
      if (error.response.error == 'HttpException: Failed to get user')
      throw new HttpException('Failed to get user', HttpStatus.INTERNAL_SERVER_ERROR);
      // Handle other errors and return the error message
      throw new HttpException('Signup failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getToken(
    userId: string = null,
    userMobile: { usercountrycode: string; usermobileno: string } | null,
  ): Promise<string> {
    try {
      const userDetails = await this.userService.getUserById(
        userId,
        userMobile.usermobileno,
      );

      // Generate and return an authentication token
      return {
        ...userDetails,
        Authorization: await this.jwtService.signAsync({
          ...userDetails,
        }),
      };
    } catch (error) {
      if (error.response.error == 'UnauthorizedException: User not found')
      throw new UnauthorizedException('User not found');
      if (error.response.error == 'HttpException: Failed to get user')
      throw new HttpException('Failed to get user', HttpStatus.INTERNAL_SERVER_ERROR);
      // Handle errors and return the error message
      throw new UnauthorizedException('Failed to generate token');
    }
  }
}
