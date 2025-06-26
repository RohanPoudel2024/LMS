import { IsDateString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  memberId: number;

  @IsInt()
  bookId: number;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @IsOptional()
  @IsBoolean()
  returned?: boolean;
}
