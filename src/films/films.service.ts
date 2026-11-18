import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './entities/film.entity';

@Injectable()
export class FilmsService {
  private films: Film[] = [];

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

    this.films = this.films.filter(
      (film) => film.id !== id,
    );
  }
}