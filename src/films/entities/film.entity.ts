import { ApiProperty } from '@nestjs/swagger';

export class Film {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Interstellar' })
  title: string;

  @ApiProperty({ example: 169 })
  durationMinutes: number;

  @ApiProperty({ example: 2014 })
  releaseYear: number;
}