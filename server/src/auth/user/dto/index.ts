import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'john.doe@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  roleId: number;

  @ApiProperty({
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  createBy: number;

  @IsOptional()
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  updateBy: number;

  @IsOptional()
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  status: number;
}
