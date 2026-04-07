import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { RoleEnum } from '@shared/enums';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 1,
  })
  password: string;

  @IsEnum(RoleEnum)
  role: RoleEnum;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 1,
  })
  newPassword: string;
}
