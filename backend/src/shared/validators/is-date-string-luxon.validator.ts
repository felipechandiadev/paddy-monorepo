import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidDate } from '../utils/luxon-utils';

/**
 * Custom validator that checks if a value is a valid YYYY-MM-DD date string
 * Uses Luxon for parsing - safe for timezone handling
 */
@ValidatorConstraint({ name: 'isDateStringLuxon', async: false })
export class IsDateStringLuxonConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    // Check basic format YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(value)) {
      return false;
    }

    // Validate with Luxon
    return isValidDate(value);
  }

  defaultMessage(): string {
    return 'Field must be a valid date string in YYYY-MM-DD format';
  }
}

/**
 * Decorator to validate date string fields
 * Usage: @IsDateStringLuxon()
 *
 * @example
 * class CreateAdvanceDto {
 *   @IsDateStringLuxon()
 *   issueDate: string;  // Expected format: 2026-04-07
 * }
 */
export function IsDateStringLuxon(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsDateStringLuxonConstraint,
    });
  };
}

/**
 * Optional date string validator - allows null/undefined
 * @example
 * class UpdateSeasonDto {
 *   @IsOptionalDateStringLuxon()
 *   endDate?: string | null;
 * }
 */
@ValidatorConstraint({ name: 'isOptionalDateStringLuxon', async: false })
export class IsOptionalDateStringLuxonConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any): boolean {
    // Allow null, undefined, or empty string
    if (value === null || value === undefined || value === '') {
      return true;
    }

    if (typeof value !== 'string') {
      return false;
    }

    // Check basic format YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(value)) {
      return false;
    }

    // Validate with Luxon
    return isValidDate(value);
  }

  defaultMessage(): string {
    return 'Field must be a valid date string in YYYY-MM-DD format or null';
  }
}

export function IsOptionalDateStringLuxon(
  validationOptions?: ValidationOptions,
) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsOptionalDateStringLuxonConstraint,
    });
  };
}
