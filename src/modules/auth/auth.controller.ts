import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthResponseEntity } from './entities/auth.entity';
import SmsService from './sms.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(SmsService) private readonly smsService: SmsService,
  ) {}

  @ApiOperation({ summary: 'Send OTP on mobile for verification' })
  @ApiOkResponse({ type: AuthResponseEntity })
  @Post('send-otp')
  @HttpCode(200)
  async sendOtp(
    @Body() sendOtpDto: SendOtpDto,
  ) {
    return await this.smsService.sendOtp(
      sendOtpDto,
    );
  }

  @ApiOperation({ summary: 'Sign up new admin' })
  @ApiCreatedResponse({ type: AuthResponseEntity })
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<any> {
    return await this.authService.signUp(signUpDto);
  }
}
