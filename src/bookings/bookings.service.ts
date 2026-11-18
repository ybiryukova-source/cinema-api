import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { HallsService } from '../halls/halls.service';
import { ShowingsService } from '../showings/showings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  private bookings: Booking[] = [];

  constructor(
    private readonly showingsService: ShowingsService,
    private readonly hallsService: HallsService,
  ) {}

  findAll(): Booking[] {
    return this.bookings;
  }

  findByShowing(showingId: string): Booking[] {
    this.showingsService.findOne(showingId);

    return this.bookings.filter(
      (booking) => booking.showingId === showingId,
    );
  }

  create(
    showingId: string,
    dto: CreateBookingDto,
  ): Booking {
    const showing = this.showingsService.findOne(showingId);
    const hall = this.hallsService.findOne(showing.hallId);

    const requestedSeats = new Set<string>();

    for (const seat of dto.seats) {
      const key = `${seat.row}:${seat.seat}`;

      if (requestedSeats.has(key)) {
        throw new BadRequestException(
          `Місце ${key} повторюється в запиті`,
        );
      }

      requestedSeats.add(key);

      if (
        seat.row < 1 ||
        seat.row > hall.rows ||
        seat.seat < 1 ||
        seat.seat > hall.seatsPerRow
      ) {
        throw new BadRequestException(
          `Місце ${key} не існує в залі`,
        );
      }
    }

    const existingBookings = this.findByShowing(showingId);

    const occupiedSeats = new Set(
      existingBookings.flatMap((booking) =>
        booking.seats.map(
          (seat) => `${seat.row}:${seat.seat}`,
        ),
      ),
    );

    for (const seat of dto.seats) {
      const key = `${seat.row}:${seat.seat}`;

      if (occupiedSeats.has(key)) {
        throw new ConflictException(
          `Місце ${key} вже заброньоване`,
        );
      }
    }

    const booking: Booking = {
      id: randomUUID(),
      showingId,
      seats: dto.seats,
      totalPrice: showing.price * dto.seats.length,
    };

    this.bookings.push(booking);

    return booking;
  }

  getShowingSeats(
    showingId: string,
  ): { row: number; seat: number; isBooked: boolean }[] {
    const showing = this.showingsService.findOne(showingId);
    const hall = this.hallsService.findOne(showing.hallId);

    const occupiedSeats = new Set(
      this.findByShowing(showingId).flatMap((booking) =>
        booking.seats.map(
          (seat) => `${seat.row}:${seat.seat}`,
        ),
      ),
    );

    return this.hallsService.getSeats(hall).map((seat) => ({
      ...seat,
      isBooked: occupiedSeats.has(
        `${seat.row}:${seat.seat}`,
      ),
    }));
  }

  remove(id: string): void {
    const booking = this.bookings.find(
      (booking) => booking.id === id,
    );

    if (!booking) {
      throw new NotFoundException(
        `Бронювання з id ${id} не знайдено`,
      );
    }

    this.bookings = this.bookings.filter(
      (booking) => booking.id !== id,
    );
  }
}