import { Module } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { FacebookRepository } from './facebook.repository';
import { FacebookController } from './facebook.controller';

@Module({
  imports: [PrismaModule],
  providers: [FacebookService, FacebookRepository],
  controllers: [FacebookController],
  exports: [FacebookService],
})
export class FacebookModule {}
