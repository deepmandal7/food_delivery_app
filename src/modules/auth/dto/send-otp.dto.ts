import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class SendOtpDto {
    @ApiProperty({ example: '9876543210' })
    @IsString()
    @IsNotEmpty()
    userMobileNo: string;
  
    @ApiProperty({ example: '+91' })
    @IsString()
    @IsNotEmpty()
    userCountryCode: string;
}
