import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Req } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthRequest } from 'src/auth/auth-request.interface';

@Controller('member')
@UseGuards(JwtAuthGuard)
export class MemberController {

  constructor(private readonly memberService: MemberService) {}

  @Post('addMember')
  create(@Body() createMemberDto: CreateMemberDto, @Req() req:AuthRequest ) {
    const librarianId = req.user.userId;
    return this.memberService.create(createMemberDto, librarianId);
  }

  @Get('get/All')
  findAll(@Req() req: AuthRequest) {
    const librarianId = req.user.userId;
    return this.memberService.findAll(librarianId);
  }

  @Get('findOne/:id')
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    const librarianId = req.user.userId;
    return this.memberService.findOne(+id, librarianId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.memberService.update(+id, updateMemberDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    const librarianId = req.user.userId;
    return this.memberService.remove(+id, librarianId);
  }
}
