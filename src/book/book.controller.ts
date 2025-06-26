import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('book')
@UseGuards(JwtAuthGuard)
export class BookController {
    constructor(private bookService:BookService) {}

    @Post('addBook')
    createBook(@Body() createBookDto:CreateBookDto, @Request() req){
        const librarianId = req.user.userId;
        return this.bookService.createBook(createBookDto,librarianId)
    }

    @Get() 
    findAllBooks(@Request() req) {
        const librarianId = req.user.userId; 
        return this.bookService.findAllBooks(librarianId);
    }
}
