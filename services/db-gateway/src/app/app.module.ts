import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from '../core/prisma/prisma.module';
import { FacebookModule } from '../core/facebook/facebook.module';

@Module({
  imports: [PrismaModule, FacebookModule],
  controllers: [AppController],
})
export class AppModule {}
