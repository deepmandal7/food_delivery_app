import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Twilio } from 'twilio';

@Injectable()
export default class SmsService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.twilioClient = new Twilio(
      configService.get('twilio_account_sid'),
      configService.get('twilio_auth_token'),
    );
  }

  private twilioClient: Twilio;

  async sendOtp(sendOtpDto: SendOtpDto) {
    try {
      let sendOtp : any
      if(this.configService.get('NODE_ENV') === 'production' ||
      this.configService.get('NODE_ENV') === 'staging') {
        sendOtp = await this.twilioClient.verify.v2
        .services(
          this.configService.get('twilio_verification_service_sid'),
        )
        .verifications.create({
          to: sendOtpDto.userCountryCode + sendOtpDto.userMobileNo,
          channel: 'sms',
        })
        return { status: sendOtp.status }
      } else {
        return { status: 'pending' }
      }
    } catch (error) {
      throw new UnauthorizedException('Failed to send OTP');
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      let result: any
      if (this.configService.get('NODE_ENV') === 'production' ||
      this.configService.get('NODE_ENV') === 'staging') {
        result = await this.twilioClient.verify.v2
        .services(
          this.configService.get('twilio_verification_service_sid'),
        )
        .verificationChecks.create({
          to: verifyOtpDto.userCountryCode + verifyOtpDto.userMobileNo,
          code: verifyOtpDto.otp,
        })
      } else if(verifyOtpDto.otp === '8888') {
        result = { valid: true, status: 'approved', sid: '999999' }
      } else  {
        result = { valid: false, status: '', sid: '999999' }
      }
      if (!result.valid || result.status !== 'approved') {
        throw new UnauthorizedException('Wrong code provided');
      }
      return result;
    } catch (error) {
      throw new UnauthorizedException('Failed to verify OTP');
    }
  }
}
