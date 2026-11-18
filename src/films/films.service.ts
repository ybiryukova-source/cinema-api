import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './entities/film.entity';
import { ShowingsService } from '../showings/showings.service';

@Injectable()
export class FilmsService {
  private films: Film[] = [];

  constructor(
    @Inject(forwardRef(() => ShowingsService))
    private readonly showingsService: ShowingsService,
  ) {}

  create(dto: CreateFilmDto): Film {
    const film: Film = {
      id: randomUUID(),
      ...dto,
    };

    this.films.push(film);
    return film;
  }

  findAll(): Film[] {
    return this.films;
  }

  findOne(id: string): Film {
    const film = this.films.find((film) => film.id === id);

    if (!film) {
      throw new NotFoundException(
        `Фільм з id ${id} не знайдено`,
      );
    }

    return film;
  }

  update(id: string, dto: UpdateFilmDto): Film {
    const film = this.findOne(id);

    Object.assign(film, dto);

    return film;
  }

  remove(id: string): void {
    this.findOne(id);

    if (this.showingsService.hasFilm(id)) {
      throw new ConflictException(
        'Неможливо видалити фільм, оскільки для нього існують сеанси',
      );
    }

    this.films = this.films.filter(
      (film) => film.id !== id,
    );
  }
}