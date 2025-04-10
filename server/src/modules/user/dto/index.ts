import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateRoleDto } from 'modules/auth/role/dto/create-role.dto';

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
    example: [1, 2],
  })
  @IsNotEmpty({ each: true })
  @IsArray({ message: 'roleId must be an array of numbers' })
  @IsNumber({}, { each: true, message: 'roleId must be an array of numbers' })
  roleId: number[];

  @IsOptional()
  @IsNumber()
  createBy: number;

  @IsOptional()
  @IsNumber()
  updateBy: number;

  @IsOptional()
  @IsNumber()
  status: number;

  @IsOptional()
  @IsString()
  createdAt: string;

  @IsOptional()
  @IsString()
  updatedAt: string;
}

export class UpdateUserDto extends CreateRoleDto {}
