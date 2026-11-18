import { ApiProperty } from '@nestjs/swagger';
import { Seat } from '../../halls/entities/hall.entity';

export class Booking {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  showingId: string;

  @ApiProperty({ type: [Seat] })
  seats: Seat[];

  @ApiProperty({
    example: 25000,
    description: 'Загальна ціна в копійках',
  })
  totalPrice: number;
}