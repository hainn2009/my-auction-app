import { Inject, Injectable } from '@nestjs/common';
import { BOOKS_PATTERNS, BookDto as ClientBookDto, CreateBookDto as ClientCreateBookDto, UpdateBookDto as ClientUpdateBookDto } from '@app/contracts';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ClientProxy } from '@nestjs/microservices';
import { BookDto } from './dto/book.dto';
import { map } from 'rxjs';
import { BOOKS_CLIENT } from './constant';

@Injectable()
export class BooksService {
  constructor(@Inject(BOOKS_CLIENT) private booksClient: ClientProxy) { }

  private mapBookDto(clientBookDto: ClientBookDto): BookDto {
    return {
      id: clientBookDto.id,
      title: clientBookDto.title,
    };
  }
  create(createBookDto: CreateBookDto) {
    return this.booksClient.send<ClientBookDto, ClientCreateBookDto>(BOOKS_PATTERNS.CREATE, createBookDto)
      .pipe(map(this.mapBookDto));
  }

  findAll() {
    return this.booksClient.send<ClientBookDto>(BOOKS_PATTERNS.FIND_ALL, {});
  }

  findOne(id: number) {
    return this.booksClient.send<ClientBookDto>(BOOKS_PATTERNS.FIND_ONE, id);
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return this.booksClient.send<ClientBookDto, ClientUpdateBookDto>(BOOKS_PATTERNS.UPDATE, { id, ...updateBookDto });
  }

  remove(id: number) {
    return this.booksClient.send(BOOKS_PATTERNS.REMOVE, id);
  }
}
