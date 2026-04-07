import { IsString, IsOptional, IsNumber, IsBoolean, IsPositive } from 'class-validator';
import {
  IsDateStringLuxon,
  IsOptionalDateStringLuxon,
} from '@shared/validators/is-date-string-luxon.validator';

// ===== RICE TYPE DTOs =====
export class CreateRiceTypeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  referencePrice: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}

export class UpdateRiceTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  referencePrice?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ===== SEASON DTOs =====
export class CreateSeasonDto {
  @IsString()
  name: string;

  @IsDateStringLuxon()
  startDate: string; // YYYY-MM-DD

  @IsDateStringLuxon()
  endDate: string; // YYYY-MM-DD

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = false;
}

export class UpdateSeasonDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptionalDateStringLuxon()
  startDate?: string;

  @IsOptionalDateStringLuxon()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ===== TEMPLATE DTOs =====
export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  producerId?: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean = false;

  @IsBoolean()
  useToleranceGroup: boolean;

  @IsNumber()
  groupToleranceValue: number;

  @IsOptional()
  @IsString()
  groupToleranceName?: string;

  // ===== HUMEDAD =====
  @IsBoolean()
  availableHumedad: boolean;

  @IsOptional()
  @IsNumber()
  percentHumedad?: number;

  @IsOptional()
  @IsNumber()
  toleranceHumedad?: number;

  @IsOptional()
  @IsBoolean()
  showToleranceHumedad?: boolean;

  @IsOptional()
  @IsBoolean()
  groupToleranceHumedad?: boolean;

  // ===== GRANOS VERDES =====
  @IsOptional()
  @IsBoolean()
  availableGranosVerdes?: boolean;

  @IsOptional()
  @IsNumber()
  percentGranosVerdes?: number;

  @IsOptional()
  @IsNumber()
  toleranceGranosVerdes?: number;

  @IsOptional()
  @IsBoolean()
  showToleranceGranosVerdes?: boolean;

  @IsOptional()
  @IsBoolean()
  groupToleranceGranosVerdes?: boolean;

  // ===== IMPUREZAS =====
  @IsOptional()
  @IsBoolean()
  availableImpurezas?: boolean;

  @IsOptional()
  @IsNumber()
  percentImpurezas?: number;

  @IsOptional()
  @IsNumber()
  toleranceImpurezas?: number;

  @IsOptional()
  @IsBoolean()
  showToleranceImpurezas?: boolean;

  @IsOptional()
  @IsBoolean()
  groupToleranceImpurezas?: boolean;

  // ===== VANO =====
  @IsOptional()
  @IsBoolean()
  availableVano?: boolean;

  @IsOptional()
  @IsNumber()
  percentVano?: number;

  @IsOptional()
  @IsNumber()
  toleranceVano?: number;

  @IsOptional()
  @IsBoolean()
  showToleranceVano?: boolean;

  @IsOptional()
  @IsBoolean()
  groupToleranceVano?: boolean;

  // ===== HUALCACHO =====
  @IsOptional()
  @IsBoolean()
  availableHualcacho?: boolean;

  @IsOptional()
  @IsNumber()
  percentHualcacho?: number;

  @IsOptional()
  @IsNumber()
  toleranceHualcacho?: number;

  @IsOptional()
  @IsBoolean()
  showToleranceHualcacho?: boolean;

  @IsOptional()
  @IsBoolean()
  groupToleranceHualcacho?: boolean;

  // ===== GRANOS MANCHADOS =====
  @IsOptional()
  @IsBoolean()
  availableGranosManchados?: boolean;

  @IsOptional()
  @IsNumber()
  percentGranosManchados?: number;

  @IsOptional()
  @IsNumber()
  toleranceGranosManchados?: number;

  @IsOptional()
  @IsBoolean()
  showToleranceGranosManchados?: boolean;

  @IsOptional()
  @IsBoolean()
  groupToleranceGranosManchados?: boolean;

  // ===== GRANOS PELADOS =====
  @IsOptional()
  @IsBoolean()
  availableGranosPelados?: boolean;

  @IsOptional()
  @IsNumber()
  percentGranosPelados?: number;

  @IsOptional()
  @IsNumber()
  toleranceGranosPelados?: number;

  @IsOptional()
  @IsBoolean()
  showToleranceGranosPelados?: boolean;

  @IsOptional()
  @IsBoolean()
  groupToleranceGranosPelados?: boolean;

  // ===== GRANOS YESOSOS =====
  @IsOptional()
  @IsBoolean()
  availableGranosYesosos?: boolean;

  @IsOptional()
  @IsNumber()
  percentGranosYesosos?: number;

  @IsOptional()
  @IsNumber()
  toleranceGranosYesosos?: number;

  @IsOptional()
  @IsBoolean()
  showToleranceGranosYesosos?: boolean;

  @IsOptional()
  @IsBoolean()
  groupToleranceGranosYesosos?: boolean;

  // ===== BONIFICACIÓN & SECADO =====
  @IsBoolean()
  availableBonus: boolean;

  @IsOptional()
  @IsNumber()
  toleranceBonus?: number;

  @IsBoolean()
  availableDry: boolean;

  @IsOptional()
  @IsNumber()
  percentDry?: number;
}

export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsBoolean()
  useToleranceGroup?: boolean;

  @IsOptional()
  @IsNumber()
  groupToleranceValue?: number;

  @IsOptional()
  @IsString()
  groupToleranceName?: string;

  // ===== HUMEDAD =====
  @IsOptional()
  @IsBoolean()
  availableHumedad?: boolean;

  @IsOptional()
  @IsNumber()
  percentHumedad?: number;

  @IsOptional()
  @IsNumber()
  toleranceHumedad?: number;

  @IsOptional()
  @IsBoolean()
  showToleranceHumedad?: boolean;

  @IsOptional()
  @IsBoolean()
  groupToleranceHumedad?: boolean;

  // ===== GRANOS VERDES =====
  @IsOptional()
  @IsBoolean()
  availableGranosVerdes?: boolean;

  @IsOptional()
  @IsNumber()
  percentGranosVerdes?: number;

  @IsOptional()
  @IsNumber()
  toleranceGranosVerdes?: number;

  @IsOptional()
  @IsBoolean()
  showToleranceGranosVerdes?: boolean;

  @IsOptional()
  @IsBoolean()
  groupToleranceGranosVerdes?: boolean;

  // ===== IMPUREZAS =====
  @IsOptional()
  @IsBoolean()
  availableImpurezas?: boolean;

  @IsOptional()
  @IsNumber()
  percentImpurezas?: number;

  @IsOptional()
  @IsNumber()
  toleranceImpurezas?: number;

  @IsOptional()
  @IsBoolean()
  showToleranceImpurezas?: boolean;

  @IsOptional()
  @IsBoolean()
  groupToleranceImpurezas?: boolean;

  // ===== VANO =====
  @IsOptional()
  @IsBoolean()
  availableVano?: boolean;

  @IsOptional()
  @IsNumber()
  percentVano?: number;

  @IsOptional()
  @IsNumber()
  toleranceVano?: number;

  @IsOptional()
  @IsBoolean()
  showToleranceVano?: boolean;

  @IsOptional()
  @IsBoolean()
  groupToleranceVano?: boolean;

  // ===== HUALCACHO =====
  @IsOptional()
  @IsBoolean()
  availableHualcacho?: boolean;

  @IsOptional()
  @IsNumber()
  percentHualcacho?: number;

  @IsOptional()
  @IsNumber()
  toleranceHualcacho?: number;

  @IsOptional()
  @IsBoolean()
  showToleranceHualcacho?: boolean;

  @IsOptional()
  @IsBoolean()
  groupToleranceHualcacho?: boolean;

  // ===== GRANOS MANCHADOS =====
  @IsOptional()
  @IsBoolean()
  availableGranosManchados?: boolean;

  @IsOptional()
  @IsNumber()
  percentGranosManchados?: number;

  @IsOptional()
  @IsNumber()
  toleranceGranosManchados?: number;

  @IsOptional()
  @IsBoolean()
  showToleranceGranosManchados?: boolean;

  @IsOptional()
  @IsBoolean()
  groupToleranceGranosManchados?: boolean;

  // ===== GRANOS PELADOS =====
  @IsOptional()
  @IsBoolean()
  availableGranosPelados?: boolean;

  @IsOptional()
  @IsNumber()
  percentGranosPelados?: number;

  @IsOptional()
  @IsNumber()
  toleranceGranosPelados?: number;

  @IsOptional()
  @IsBoolean()
  showToleranceGranosPelados?: boolean;

  @IsOptional()
  @IsBoolean()
  groupToleranceGranosPelados?: boolean;

  // ===== GRANOS YESOSOS =====
  @IsOptional()
  @IsBoolean()
  availableGranosYesosos?: boolean;

  @IsOptional()
  @IsNumber()
  percentGranosYesosos?: number;

  @IsOptional()
  @IsNumber()
  toleranceGranosYesosos?: number;

  @IsOptional()
  @IsBoolean()
  showToleranceGranosYesosos?: boolean;

  @IsOptional()
  @IsBoolean()
  groupToleranceGranosYesosos?: boolean;

  // ===== BONIFICACIÓN & SECADO =====
  @IsOptional()
  @IsBoolean()
  availableBonus?: boolean;

  @IsOptional()
  @IsNumber()
  toleranceBonus?: number;

  @IsOptional()
  @IsBoolean()
  availableDry?: boolean;

  @IsOptional()
  @IsNumber()
  percentDry?: number;
}

// ===== ANALYSIS PARAM DTOs =====
export class CreateAnalysisParamDto {
  // Primary fields used by frontend dialog
  @IsOptional()
  @IsNumber()
  paramCode: number; // 1=Humedad, 2=Impurezas, 9=Vano, etc.

  @IsOptional()
  @IsNumber()
  start: number;

  @IsOptional()
  @IsNumber()
  end: number;

  @IsOptional()
  @IsNumber()
  percent: number;

  // Compatibility aliases (existing clients may still send entity-like fields)
  @IsOptional()
  @IsNumber()
  discountCode?: number;

  @IsOptional()
  @IsNumber()
  rangeStart?: number;

  @IsOptional()
  @IsNumber()
  rangeEnd?: number;

  @IsOptional()
  @IsNumber()
  discountPercent?: number;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  discountName?: string;

  @IsOptional()
  @IsString()
  unit?: string;
}

export class UpdateAnalysisParamDto {
  // Primary fields used by frontend dialog
  @IsOptional()
  @IsNumber()
  paramCode?: number;

  @IsOptional()
  @IsNumber()
  start?: number;

  @IsOptional()
  @IsNumber()
  end?: number;

  @IsOptional()
  @IsNumber()
  percent?: number;

  // Compatibility aliases (existing clients may still send entity-like fields)
  @IsOptional()
  @IsNumber()
  discountCode?: number;

  @IsOptional()
  @IsNumber()
  rangeStart?: number;

  @IsOptional()
  @IsNumber()
  rangeEnd?: number;

  @IsOptional()
  @IsNumber()
  discountPercent?: number;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
