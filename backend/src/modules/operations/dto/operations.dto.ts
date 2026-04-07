import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsPositive,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsDateStringLuxon,
  IsOptionalDateStringLuxon,
} from '@shared/validators/is-date-string-luxon.validator';
import { ReceptionStatusEnum } from '@shared/enums';

// ===== RECEPTION DTOs =====
export class CreateReceptionDto {
  @IsNumber()
  @IsPositive()
  producerId: number;

  @IsNumber()
  @IsPositive()
  templateId: number;

  @IsNumber()
  @IsPositive()
  seasonId: number;

  @IsNumber()
  @IsPositive()
  riceTypeId: number;

  @IsString()
  guideNumber: string;

  @IsNumber()
  @IsPositive()
  ricePrice: number;

  @IsString()
  licensePlate: string;

  @IsNumber()
  @IsPositive()
  grossWeight: number;

  @IsNumber()
  @Min(0)
  tareWeight: number;

  @IsOptional()
  @IsNumber()
  dryPercent?: number;

  @IsOptional()
  @IsBoolean()
  dryFeeApplied?: boolean;

  @IsOptionalDateStringLuxon()
  receptionDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateReceptionDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  producerId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  templateId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  seasonId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  riceTypeId?: number;

  @IsOptional()
  @IsString()
  guideNumber?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  ricePrice?: number;

  @IsOptional()
  @IsString()
  licensePlate?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  grossWeight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tareWeight?: number;

  @IsOptional()
  @IsNumber()
  dryPercent?: number;

  @IsOptional()
  @IsBoolean()
  dryFeeApplied?: boolean;

  @IsOptional()
  @IsString()
  receptionDate?: string;

  @IsOptional()
  @IsEnum(ReceptionStatusEnum)
  status?: ReceptionStatusEnum;

  @IsOptional()
  @IsString()
  notes?: string;
}

// ===== ANALYSIS RECORD DTOs =====
class AnalysisRecordSnapshotFieldsDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  templateId?: number;

  @IsOptional()
  @IsBoolean()
  useToleranceGroup?: boolean;

  @IsOptional()
  @IsString()
  groupToleranceName?: string;

  @IsOptional()
  @IsNumber()
  groupToleranceValue?: number;

  @IsOptional()
  @IsNumber()
  humedadValue?: number;

  @IsOptional()
  @IsNumber()
  humedadTolerance?: number;

  @IsOptional()
  @IsBoolean()
  humedadIsGroup?: boolean;

  @IsOptional()
  @IsBoolean()
  humedadTolVisible?: boolean;

  @IsOptional()
  @IsNumber()
  verdesValue?: number;

  @IsOptional()
  @IsNumber()
  verdesPercent?: number;

  @IsOptional()
  @IsNumber()
  verdesTolerance?: number;

  @IsOptional()
  @IsBoolean()
  verdesIsGroup?: boolean;

  @IsOptional()
  @IsBoolean()
  verdesTolVisible?: boolean;

  @IsOptional()
  @IsNumber()
  impurezasValue?: number;

  @IsOptional()
  @IsNumber()
  impurezasTolerance?: number;

  @IsOptional()
  @IsBoolean()
  impurezasIsGroup?: boolean;

  @IsOptional()
  @IsBoolean()
  impurezasTolVisible?: boolean;

  @IsOptional()
  @IsNumber()
  vanoValue?: number;

  @IsOptional()
  @IsNumber()
  vanoPercent?: number;

  @IsOptional()
  @IsNumber()
  vanoTolerance?: number;

  @IsOptional()
  @IsBoolean()
  vanoIsGroup?: boolean;

  @IsOptional()
  @IsBoolean()
  vanoTolVisible?: boolean;

  @IsOptional()
  @IsNumber()
  hualcachoValue?: number;

  @IsOptional()
  @IsNumber()
  hualcachoPercent?: number;

  @IsOptional()
  @IsNumber()
  hualcachoTolerance?: number;

  @IsOptional()
  @IsBoolean()
  hualcachoIsGroup?: boolean;

  @IsOptional()
  @IsBoolean()
  hualcachoTolVisible?: boolean;

  @IsOptional()
  @IsNumber()
  manchadosValue?: number;

  @IsOptional()
  @IsNumber()
  manchadosPercent?: number;

  @IsOptional()
  @IsNumber()
  manchadosTolerance?: number;

  @IsOptional()
  @IsBoolean()
  manchadosIsGroup?: boolean;

  @IsOptional()
  @IsBoolean()
  manchadosTolVisible?: boolean;

  @IsOptional()
  @IsNumber()
  peladosValue?: number;

  @IsOptional()
  @IsNumber()
  peladosPercent?: number;

  @IsOptional()
  @IsNumber()
  peladosTolerance?: number;

  @IsOptional()
  @IsBoolean()
  peladosIsGroup?: boolean;

  @IsOptional()
  @IsBoolean()
  peladosTolVisible?: boolean;

  @IsOptional()
  @IsNumber()
  yesososValue?: number;

  @IsOptional()
  @IsNumber()
  yesososPercent?: number;

  @IsOptional()
  @IsNumber()
  yesososTolerance?: number;

  @IsOptional()
  @IsBoolean()
  yesososIsGroup?: boolean;

  @IsOptional()
  @IsBoolean()
  yesososTolVisible?: boolean;

  @IsOptional()
  @IsNumber()
  summaryPercent?: number;

  @IsOptional()
  @IsNumber()
  summaryTolerance?: number;

  @IsOptional()
  @IsNumber()
  summaryPenaltyKg?: number;

  @IsOptional()
  @IsBoolean()
  bonusEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  bonusPercent?: number;

  @IsOptional()
  @IsNumber()
  totalGroupPercent?: number;

  @IsOptional()
  @IsNumber()
  groupPercent?: number;

  @IsOptional()
  @IsNumber()
  groupTolerance?: number;

  @IsOptional()
  @IsNumber()
  dryPercent?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateAnalysisRecordDto extends AnalysisRecordSnapshotFieldsDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  receptionId?: number;

  @IsNumber()
  humedadRange: number;

  @IsNumber()
  humedadPercent: number;

  @IsNumber()
  impurezasRange: number;

  @IsNumber()
  impurezasPercent: number;

  @IsOptional()
  @IsNumber()
  verdesRange?: number;

  @IsOptional()
  @IsNumber()
  manchadosRange?: number;

  @IsOptional()
  @IsNumber()
  yesososRange?: number;

  @IsOptional()
  @IsNumber()
  peladosRange?: number;

  @IsOptional()
  @IsNumber()
  vanoRange?: number;

  @IsOptional()
  @IsNumber()
  hualcachoRange?: number;
}

export class UpdateAnalysisRecordDto extends AnalysisRecordSnapshotFieldsDto {
  @IsOptional()
  @IsNumber()
  humedadRange?: number;

  @IsOptional()
  @IsNumber()
  humedadPercent?: number;

  @IsOptional()
  @IsNumber()
  impurezasRange?: number;

  @IsOptional()
  @IsNumber()
  impurezasPercent?: number;

  @IsOptional()
  @IsNumber()
  verdesRange?: number;

  @IsOptional()
  @IsNumber()
  manchadosRange?: number;

  @IsOptional()
  @IsNumber()
  yesososRange?: number;

  @IsOptional()
  @IsNumber()
  peladosRange?: number;

  @IsOptional()
  @IsNumber()
  vanoRange?: number;

  @IsOptional()
  @IsNumber()
  hualcachoRange?: number;
}

export class CreateReceptionWithAnalysisDto {
  @ValidateNested()
  @Type(() => CreateReceptionDto)
  reception: CreateReceptionDto;

  @ValidateNested()
  @Type(() => CreateAnalysisRecordDto)
  analysis: CreateAnalysisRecordDto;
}

export class UpdateReceptionRicePriceDto {
  @IsNumber()
  @IsPositive()
  ricePrice: number;
}

export class UpdateAnalysisDryPercentDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  dryPercent: number;
}
