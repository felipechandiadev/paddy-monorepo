import {
  ArrayUnique,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
  IsPositive,
  IsBoolean,
  IsInt,
  IsObject,
  Min,
} from 'class-validator';
import {
  IsDateStringLuxon,
  IsOptionalDateStringLuxon,
} from '@shared/validators/is-date-string-luxon.validator';
import {
  AdvanceStatusEnum,
  PaymentMethodEnum,
  SettlementStatusEnum,
  TransactionTypeEnum,
} from '@shared/enums';

// ===== ADVANCE DTOs =====
export class CreateAdvanceDto {
  @IsNumber()
  @IsPositive()
  producerId: number;

  @IsNumber()
  @IsPositive()
  seasonId: number;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsDateStringLuxon()
  issueDate: string; // YYYY-MM-DD

  @IsNumber()
  @Min(0)
  interestRate: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;

  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @IsOptional()
  @IsString()
  paymentNotes?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  bankAccountIndex?: number;

  @IsOptional()
  @IsString()
  checkBankName?: string;

  @IsOptional()
  @IsString()
  checkIssueDate?: string;

  @IsOptional()
  @IsString()
  checkDueDate?: string;

  @IsOptional()
  @IsString()
  checkPayeeName?: string;

  @IsOptional()
  @IsString()
  checkPayeeRut?: string;
}

export class UpdateAdvanceDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  seasonId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsString()
  issueDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  interestRate?: number;

  @IsOptional()
  @IsOptionalDateStringLuxon()
  description?: string;

  @IsOptional()
  @IsString()
  interestEndDate?: string | null;

  @IsOptional()
  @IsBoolean()
  isInterestCalculationEnabled?: boolean;

  @IsOptional()
  @IsEnum(AdvanceStatusEnum)
  status?: AdvanceStatusEnum;

  @IsOptional()
  @IsEnum(PaymentMethodEnum)
  paymentMethod?: PaymentMethodEnum;

  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @IsOptional()
  @IsString()
  paymentNotes?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  bankAccountIndex?: number;

  @IsOptional()
  @IsString()
  checkBankName?: string;

  @IsOptional()
  @IsString()
  checkIssueDate?: string;

  @IsOptional()
  @IsString()
  checkDueDate?: string;

  @IsOptional()
  @IsString()
  checkPayeeName?: string;

  @IsOptional()
  @IsString()
  checkPayeeRut?: string;
}

// ===== TRANSACTION DTOs =====
export class CreateTransactionDto {
  @IsNumber()
  @IsPositive()
  producerId: number;

  @IsEnum(TransactionTypeEnum)
  type: TransactionTypeEnum;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  receptionId?: number;

  @IsOptional()
  @IsNumber()
  advanceId?: number;

  @IsOptional()
  @IsNumber()
  settlementId?: number;
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsEnum(TransactionTypeEnum)
  type?: TransactionTypeEnum;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

// ===== SETTLEMENT DTOs =====
export class CreateSettlementDto {
  @IsNumber()
  @IsPositive()
  producerId: number;

  @IsNumber()
  @IsPositive()
  seasonId: number;

  @IsArray()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  receptionIds: number[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  advanceIds?: number[];

  @IsOptional()
  @IsObject()
  calculationDetails?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateSettlementDto {
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  receptionIds?: number[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  advanceIds?: number[];

  @IsOptional()
  @IsObject()
  calculationDetails?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(SettlementStatusEnum)
  status?: SettlementStatusEnum;
}

export class CompleteSettlementDto {
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  receptionIds?: number[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  advanceIds?: number[];

  @IsOptional()
  @IsObject()
  calculationDetails?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsObject()
  paymentDetails?: Record<string, unknown>;
}

export class SettlementActionDto {
  @IsOptional()
  @IsString()
  notes?: string;
}
