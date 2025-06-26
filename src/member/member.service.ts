import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMemberDto, librarianId: number) {
    try {
      const existingMember = await this.prisma.member.findFirst({
        where: {
          email: data.email,
          librarianId: librarianId
        },
        include:{
          librarian: true
        }
      });



      if (existingMember) {
        throw new BadRequestException(`Member with email ${data.email} already exists`);
      }

      const member = await this.prisma.member.create({
        data: {
          name: data.name,
          email: data.email,
          librarianId: librarianId
        }
      });

      return {
        success: true,
        message: "Member created successfully",
        statusCode: 201,
        data: member
      };

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      console.log(error);
      throw new InternalServerErrorException('Failed to create member');
    }
  }


  async findAll(librarianId:number) {
    return await this.prisma.member.findMany({
      where:{
        librarianId:librarianId
      },
      select:{
        id:true,
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

  async remove(id: number, librarianId:number) {
    
    const member = await this.prisma.member.findUnique({
      where: {
        id: id,
        librarianId: librarianId
      },
      });
    if (!member) {
      throw new InternalServerErrorException(`Member with id ${id} not found or you do not have permission to delete this member`);
    }
    
    try{
      await this.prisma.member.delete({
        where:{
          id:id,
          librarianId:librarianId
        },
        include:{
          librarian: true
        }
      })
      return{
        success: true,
        message: "Member deleted successfully",
        statusCode: 200
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(`member with id ${id} not found or you do not have permission to delete this member`);
    }
  
  }
}
