import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  password: string;
}

export class UpdateUserScoreDto {
  @IsNumber()
  @Min(0)
  score: number;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  userId: string;
}

export class ListUserDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  page: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  perPage: number;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  pagination: boolean;
}
