import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: [1, 2],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  permissions: number[];

  @IsOptional()
  @IsNumber()
  createBy: number;

  @IsOptional()
  @IsNumber()
  updateBy: number;

  @IsOptional()
  @IsString()
  createdAt: string;

  @IsOptional()
  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsNumber()
  status: number;
}
