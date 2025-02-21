import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Route } from 'routes/entities/route.entity';

export class CreateRouteDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({ example: 'Home' })
  @IsString()
  name: string;

  @ApiProperty({ example: null })
  @IsOptional()
  parent: Route;

  @ApiProperty({ example: 'home' })
  @IsString()
  path: string;

  @ApiProperty({ example: [1, 2] })
  @IsArray()
  @IsOptional()
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
