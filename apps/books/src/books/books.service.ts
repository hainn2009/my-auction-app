import { CreateBookDto, UpdateBookDto } from '@app/contracts';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/books.schema';

@Injectable()
export class BooksService {
  // private books: BookDto[] = [
  //   {
  //     id: 1,
  //     title: 'Book 1',
  //     author: 'Author 1',
  //     rating: 4.5,
  //   },
  //   {
  //     id: 2,
  //     title: 'Book 2',
  //     author: 'Author 2',
  //     rating: 4.0,
  //   },
  // ];
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>,) { }

  create(createBookDto: CreateBookDto): Promise<Book> {
    const newBook = new this.bookModel(createBookDto);
    return newBook.save();
  }

  findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  findOne(id: number): Promise<Book | null> {
    return this.bookModel.findById(id).exec();
  }

  update(id: number, updateBookDto: UpdateBookDto): Promise<Book | null> {
    return this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true }).exec();
  }

  remove(id: number): Promise<Book | null> {
    return this.bookModel.findByIdAndDelete(id).exec();
  }
}
