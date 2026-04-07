import {
  IsString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsEnum,
  IsNumber,
  IsPositive,
  MinLength,
} from 'class-validator';

enum BankAccountTypeEnum {
  CORRIENTE = 'corriente',
  VISTA = 'vista',
  AHORRO = 'ahorro',
  RUT = 'rut',
}

export class CreateProducerDto {
  @IsString()
  @MinLength(9)
  rut: string; // Format: 12345678-9

  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class UpdateProducerDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class AddBankAccountDto {
  @IsString()
  bankName: string;

  @IsEnum(BankAccountTypeEnum)
  accountType: BankAccountTypeEnum;

  @IsString()
  accountNumber: string;

  @IsOptional()
  @IsString()
  holderName?: string;

  @IsString()
  holderRut: string;

  @IsOptional()
  isDefault?: boolean;
}

export class UpdateBankAccountDto {
  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsEnum(BankAccountTypeEnum)
  accountType?: BankAccountTypeEnum;

  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  holderName?: string;

  @IsOptional()
  @IsString()
  holderRut?: string;

  @IsOptional()
  isDefault?: boolean;
}
