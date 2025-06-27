import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookService {
    constructor(private prisma : PrismaService){}

    async createBook(data:CreateBookDto, librarianId:number){
        try{
            const book = await this.prisma.book.create({
                data:{
                    title:data.title,
                    available:data.available,
                    userId:librarianId,
                    publishedYear:data.publishedYear,
                    author:data.author,
                    // createdAt:data.createdAt
                },
                select:{
                    id:true,
                    title:true,
                    available:true,
                    userId:true,
                    publishedYear:true,
                    author:true,
                }
            });
            return{
                message:`book Created successfully`,
                data:book
            };
        }catch(error){
            throw new Error(`failed to create book ${error}`)
        }
    }

    async findAllBooks(librarianId:number){
        return this.prisma.book.findMany({
            where:{
                userId:librarianId
            },
            select : {
                    title:true,
                    available:true,
                    userId:true,
                    publishedYear:true,
                    author:true,
                    createdAt:true
            }
        })
    }
}

