import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'create',
  })
  @IsString()
  name: string;

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
  createdAt: Date;

  @IsOptional()
  @IsString()
  updatedAt: Date;
}
