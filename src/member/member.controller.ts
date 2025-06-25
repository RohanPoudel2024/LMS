import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('member')
@UseGuards(JwtAuthGuard)
export class MemberController {

  constructor(private readonly memberService: MemberService) {}

  @Post('addMember')
  create(@Body() createMemberDto: CreateMemberDto, @Request() req ) {
    const librarianId = req.user.userId;
    return this.memberService.create(createMemberDto, librarianId);
  }

  @Get()
  findAll(@Request() req) {
    const librarianId = req.user.userId;
    return this.memberService.findAll(librarianId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.memberService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberService.remove(+id);
  }
}
