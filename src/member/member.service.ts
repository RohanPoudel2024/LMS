import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MemberService {
  constructor(private prisma:PrismaService){}
  async create(data: CreateMemberDto, librarianId:number) {

    try{
        const member = await this.prisma.member.create({
          data:{
            name:data.name,
            email:data.email,
            librarianId:librarianId
          }
        });
        return {
          message:"member created successfully",
          data:member
        }
      }catch(e){
        console.log(e)
        return{
          message:`failed to create member user with email ${data.email} already exists`,
          error:e,
          statusCode:500,
          data:null
        }
      }
  }


  async findAll(librarianId:number) {
    return await this.prisma.member.findMany({
      where:{
        librarianId:librarianId
      },
      select:{
        name:true,
        email:true,
        librarianId:true
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
