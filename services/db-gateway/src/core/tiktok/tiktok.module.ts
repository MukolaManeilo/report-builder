import { Module } from '@nestjs/common';
import { TiktokService } from './tiktok.service';
import { TiktokController } from './tiktok.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TiktokController],
  providers: [TiktokService],
  exports: [TiktokService],
})
export class TiktokModule {}
