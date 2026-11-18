import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmsService } from '../films/films.service';
import { HallsService } from '../halls/halls.service';
import { CreateShowingDto } from './dto/create-showing.dto';
import { FindShowingsQueryDto } from './dto/find-showings-query.dto';
import {
  Showing,
  ShowingDetails,
} from './entities/showing.entity';

@Injectable()
export class ShowingsService {
  private showings: Showing[] = [];

  constructor(
    private readonly filmsService: FilmsService,
    private readonly hallsService: HallsService,
  ) {}

  create(dto: CreateShowingDto): Showing {
    try {
      this.filmsService.findOne(dto.filmId);
    } catch {
      throw new BadRequestException(
        `Фільм з id ${dto.filmId} не знайдено`,
      );
    }

    try {
      this.hallsService.findOne(dto.hallId);
    } catch {
      throw new BadRequestException(
        `Зал з id ${dto.hallId} не знайдено`,
      );
    }

    const startsAt = new Date(dto.startsAt);

    if (
      Number.isNaN(startsAt.getTime()) ||
      startsAt.getTime() <= Date.now()
    ) {
      throw new BadRequestException(
        'startsAt має бути коректною датою в майбутньому',
      );
    }

    const showing: Showing = {
      id: randomUUID(),
      filmId: dto.filmId,
      hallId: dto.hallId,
      startsAt: startsAt.toISOString(),
      price: dto.price,
    };

    this.showings.push(showing);
    return showing;
  }

  findAll(query: FindShowingsQueryDto): ShowingDetails[] {
    let result = [...this.showings];

    if (query.filmId) {
      result = result.filter(
        (showing) => showing.filmId === query.filmId,
      );
    }

    if (query.date) {
      result = result.filter(
        (showing) =>
          showing.startsAt.slice(0, 10) === query.date,
      );
    }

    result.sort((a, b) => {
      const timeDifference =
        new Date(a.startsAt).getTime() -
        new Date(b.startsAt).getTime();

      if (timeDifference !== 0) {
        return timeDifference;
      }

      return a.id.localeCompare(b.id);
    });

    return result.map((showing) =>
      this.toDetails(showing),
    );
  }

  findOne(id: string): Showing {
    const showing = this.showings.find(
      (showing) => showing.id === id,
    );

    if (!showing) {
      throw new NotFoundException(
        `Сеанс з id ${id} не знайдено`,
      );
    }

    return showing;
  }

  findOneDetails(id: string): ShowingDetails {
    return this.toDetails(this.findOne(id));
  }

  hasFilm(filmId: string): boolean {
    return this.showings.some(
      (showing) => showing.filmId === filmId,
    );
  }

  hasHall(hallId: string): boolean {
    return this.showings.some(
      (showing) => showing.hallId === hallId,
    );
  }

  private toDetails(showing: Showing): ShowingDetails {
    const film = this.filmsService.findOne(
      showing.filmId,
    );

    const hall = this.hallsService.findOne(
      showing.hallId,
    );

    return {
      id: showing.id,
      filmTitle: film.title,
      hallName: hall.name,
      startsAt: showing.startsAt,
      price: showing.price,
    };
  }
}