import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidCalendarDate', async: false })
class IsValidCalendarDate implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    return (
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }

  defaultMessage(): string {
    return 'date має бути коректною датою у форматі YYYY-MM-DD';
  }
}

export class FindShowingsQueryDto {
  @ApiPropertyOptional({
    description: 'ID фільму',
    format: 'uuid',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  filmId?: string;

  @ApiPropertyOptional({
    example: '2027-01-15',
    description: 'Дата у форматі YYYY-MM-DD',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date має бути у форматі YYYY-MM-DD',
  })
  @Validate(IsValidCalendarDate)
  date?: string;
}