import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Book } from './/schemas/book.schema';
import { Query } from 'express-serve-static-core';
@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAll(query: Query): Promise<Book[]> {
    const keyword = query.keyword
    ? {
        title: {
          $regex: query.keyword,
          $options: 'i',
        },
      }
    : {};
    const books = await this.bookModel.find({...keyword});
    return books;
  }
  
  async create(book: Book): Promise<Book> {
    const res = await this.bookModel.create(book);
    return res;
  }
  async findById(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    return book;
  }
  async updateById(id: string, book: Book): Promise<Book> {
    return await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Book> {
    return await this.bookModel.findByIdAndDelete(id);
  }

}