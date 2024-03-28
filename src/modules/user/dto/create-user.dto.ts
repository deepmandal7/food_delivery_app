import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'johndoe123' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'johndoe123' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsString()
  userMobileNo: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsString()
  userCountryCode: string;
}
