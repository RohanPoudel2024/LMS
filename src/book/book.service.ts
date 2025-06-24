import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BookService {
    constructor(private prisma : PrismaService){}

    findMany()
}
