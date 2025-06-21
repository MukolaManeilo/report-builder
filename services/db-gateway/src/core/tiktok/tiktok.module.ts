import { Module } from '@nestjs/common';
import { TiktokService } from './tiktok.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { TiktokController } from './tiktok.controller';
import { TiktokRepository } from './tiktok.repository';

@Module({
  imports: [PrismaModule],
  providers: [TiktokService, TiktokRepository],
  controllers: [TiktokController],
  exports: [TiktokService],
})
export class TiktokModule {}
