import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserCreateDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService){}

    async createUser(data:UserCreateDto){

        const existingUser = await this.prisma.user.findUnique({
            where:{
                email:data.email,
            }
        });

        if(existingUser){
            return {
                message:"user already exists",
                statusCode:400
            }
        }
        const hashed =  await bcrypt.hash(data.password, 10);
        try{
            const user = await this.prisma.user.create({
                data:{
                    name:data.name,
                    email:data.email,
                    password:hashed
                },
                select:{
                    name:true,
                    email:true,
                    password:true
                }
            });
            return {
                messagge:"user created successpully",
                data:user
                
            }
        }catch(e){
            console.log(e)
        }
    }

    async findAllUsers(){
        return this.prisma.user.findMany({
            select:{
                    name:true,
                    email:true,
                    password:true
            }
        })
    }
    async findByEmail(email:string){
        return this.prisma.user.findUnique({
            where:{
                email:email
            },
            select:{
                name:true,
                email:true,
                password:true
            }
        });
    }
}
