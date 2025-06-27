import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserCreateDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService:UserService){}

    @Post('adduser')
    addUser(@Body() rules:UserCreateDto){
        return this.userService.createUser(rules);
    }
    
    @Get('get/All')
    findAllUsers(){
        return this.userService.findAllUsers()
    }
}
