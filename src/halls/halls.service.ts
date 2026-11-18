import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateHallDto } from './dto/create-hall.dto';
import { Hall, HallWithSeats, Seat } from './entities/hall.entity';
import { ShowingsService } from '../showings/showings.service';

@Injectable()
export class HallsService {
  private halls: Hall[] = [];

  constructor(
    @Inject(forwardRef(() => ShowingsService))
    private readonly showingsService: ShowingsService,
  ) {}

  create(dto: CreateHallDto): Hall {
    const exists = this.halls.some(
      (hall) => hall.name === dto.name,
    );

    if (exists) {
      throw new ConflictException(
        `Зал з назвою "${dto.name}" вже існує`,
      );
    }

    const hall: Hall = {
      id: randomUUID(),
      ...dto,
    };

    this.halls.push(hall);
    return hall;
  }

  findAll(): Hall[] {
    return this.halls;
  }

  findOne(id: string): Hall {
    const hall = this.halls.find((hall) => hall.id === id);

    if (!hall) {
      throw new NotFoundException(
        `Зал з id ${id} не знайдено`,
      );
    }

    return hall;
  }

  getSeats(hall: Hall): Seat[] {
    const seats: Seat[] = [];

    for (let row = 1; row <= hall.rows; row++) {
      for (let seat = 1; seat <= hall.seatsPerRow; seat++) {
        seats.push({ row, seat });
      }
    }

    return seats;
  }

  findOneWithSeats(id: string): HallWithSeats {
    const hall = this.findOne(id);

    return {
      ...hall,
      seats: this.getSeats(hall),
    };
  }

  remove(id: string): void {
    this.findOne(id);

    if (this.showingsService.hasHall(id)) {
      throw new ConflictException(
        'Неможливо видалити зал, оскільки для нього існують сеанси',
      );
    }

    this.halls = this.halls.filter(
      (hall) => hall.id !== id,
    );
  }
}