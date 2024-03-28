import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: '9876543210' })
  @IsString()
  @IsNotEmpty()
  userMobileNo: string;

  @ApiProperty({ example: '+91' })
  @IsString()
  @IsNotEmpty()
  userCountryCode: string;

  @ApiProperty({ example: '8888' })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
