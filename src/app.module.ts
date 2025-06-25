import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { MemberModule } from './member/member.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal:true,
  }),BookModule, UserModule, TransactionModule, MemberModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
