import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransactionService {

  constructor(private prisma:PrismaService) {}

  async createTransaction(create: CreateTransactionDto, librarianId:number) {
    try{

      const book = await this.prisma.book.findUnique({
        where:{
          id:create.bookId,
          userId:librarianId,
        },
        select:{
          id:true,
          title:true,
        }
      });

      if(!book){
        return{
          success:false,
          message:"book not found",
          statusCode:404
        }
      }


      const member =  await this.prisma.member.findUnique({
        where:{
          id:create.memberId,
          librarianId:librarianId,
        },
        select:{
          id:true,
          name:true,
          email:true
        }
      });

      if(!member){
        return{
          success:false,
          message:"member not found",
          statusCode:404
        }
      }



      
      const transactionCount = await this.prisma.transaction.count({
        where:{
          bookId:create.bookId,
          memberId:create.memberId,
          returned:false
        }
      });
      if(transactionCount >= 5){
        return{
          success:false,
          message:"member has already borrowed 5 books",
          statusCode:400,
          status:2
        }
      }

const autoReturnDate = new Date();
autoReturnDate.setDate(autoReturnDate.getDate()+14);

// const remainingDays = Math.max(
//   0,
//   Math.ceil((autoReturnDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
// );

const transaction = await this.prisma.transaction.create({
  data:{
    memberId:create.memberId,
    bookId:create.bookId,
    returnDate:autoReturnDate,
    returned:create.returned,
  },
        include:{
          member:{
            select:{
              id:true,
              name:true,
              email:true
            }
          },
          book:{
            select:{
              id:true,
              title:true,
              author:true,
            }
          }
        }
      });
      return {
        select:{
          message:"transaction created successfully",
          data:transaction
        }
      }
    }catch(e){
      return {
                success: false,
                message: 'Error creating transaction',
                statusCode: 500,
                error: e.message,
            };

    }
  }

  findAll(librarianId:number) {
    return this.prisma.transaction.findMany({
      where:{
        book:{
          userId:librarianId
        }
      },
        select:{issueDate:true,
          memberId:true,
          bookId:true,
          returnDate:true,
          returned:true}
    });
    
  }



  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
