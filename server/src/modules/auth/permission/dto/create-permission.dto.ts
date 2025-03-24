import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'create',
  })
  @IsString()
  name: string;

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
