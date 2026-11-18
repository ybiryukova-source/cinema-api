import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ShowingsService } from './showings.service';
import { CreateShowingDto } from './dto/create-showing.dto';
import { FindShowingsQueryDto } from './dto/find-showings-query.dto';
import {
  Showing,
  ShowingDetails,
} from './entities/showing.entity';

@ApiTags('Showings')
@Controller('showings')
export class ShowingsController {
  constructor(
    private readonly showingsService: ShowingsService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: Showing })
  @ApiBadRequestResponse({
    description: 'Некоректні дані або неіснуючий фільм чи зал',
  })
  create(@Body() dto: CreateShowingDto): Showing {
    return this.showingsService.create(dto);
  }

  @Get()
  @ApiOkResponse({ type: [ShowingDetails] })
  @ApiBadRequestResponse({
    description: 'Некоректний формат date',
  })
  findAll(
    @Query() query: FindShowingsQueryDto,
  ): ShowingDetails[] {
    return this.showingsService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: ShowingDetails })
  @ApiNotFoundResponse({
    description: 'Сеанс не знайдено',
  })
  findOne(@Param('id') id: string): ShowingDetails {
    return this.showingsService.findOneDetails(id);
  }
}