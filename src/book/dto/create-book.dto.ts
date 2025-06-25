import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsInt()
  publishedYear: number;


  @IsBoolean()
  available: boolean;

}
