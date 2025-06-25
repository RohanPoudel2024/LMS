import { IsEmail, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateAuthDto {
    @IsEmail({},{message: 'Invalid email format'})
    email: string;

    @IsString()
    password: string;
}
