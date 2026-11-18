import { Module } from '@nestjs/common';
import { HallsModule } from '../halls/halls.module';
import { ShowingsModule } from '../showings/showings.module';
import {
  BookingsController,
  ShowingBookingsController,
} from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [ShowingsModule, HallsModule],
  controllers: [
    BookingsController,
    ShowingBookingsController,
  ],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}