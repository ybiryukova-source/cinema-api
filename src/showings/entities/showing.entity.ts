import { ApiProperty } from '@nestjs/swagger';

export class Showing {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  filmId: string;

  @ApiProperty({ format: 'uuid' })
  hallId: string;

  @ApiProperty({
    example: '2027-01-15T18:00:00.000Z',
  })
  startsAt: string;

  @ApiProperty({ example: 12500 })
  price: number;
}

export class ShowingDetails {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Interstellar' })
  filmTitle: string;

  @ApiProperty({ example: 'Зал №1' })
  hallName: string;

  @ApiProperty({
    example: '2027-01-15T18:00:00.000Z',
  })
  startsAt: string;

  @ApiProperty({ example: 12500 })
  price: number;
}