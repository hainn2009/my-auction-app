import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto, BOOKS_PATTERNS } from '@app/contracts';

@Controller()
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @MessagePattern(BOOKS_PATTERNS.CREATE)
  create(@Payload() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @MessagePattern(BOOKS_PATTERNS.FIND_ALL)
  findAll() {
    return this.booksService.findAll();
  }

  @MessagePattern(BOOKS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number) {
    return this.booksService.findOne(id);
  }

  @MessagePattern(BOOKS_PATTERNS.UPDATE)
  update(@Payload() { id, updateBookDto }: { id: number, updateBookDto: UpdateBookDto }) {
    return this.booksService.update(id, updateBookDto);
  }

  @MessagePattern(BOOKS_PATTERNS.REMOVE)
  remove(@Payload() id: number) {
    return this.booksService.remove(id);
  }
}
