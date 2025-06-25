import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async validate(createAuthDto: CreateAuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: createAuthDto.email,
        }
      });
      
      if (!user) {
        return {
          success: false,
          message: 'User not registered. Please sign up first.',
          statusCode: 401,
        };
      }
      
      const isPasswordValid = await bcrypt.compare(createAuthDto.password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid password',
          statusCode: 401,
        };
      }
      
      const payload = {
        sub: user.id,       
        email: user.email,   
        name: user.name,     
        iat: Math.floor(Date.now() / 1000), 
      };
      
      const { password, ...userData } = user;
      
      return {
        success: true,
        message: 'User authenticated successfully',
        statusCode: 200,
        data: userData,
        accessToken: this.jwtService.sign(payload), 
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error during authentication',
        statusCode: 500,
        error: error.message,
      };
    }
  }
}
