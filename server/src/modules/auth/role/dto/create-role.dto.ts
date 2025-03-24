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
