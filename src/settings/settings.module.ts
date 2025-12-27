import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { PrismaService } from '../prisma/prisma.service'
import { SettingsController } from './settings.controller';

@Module({
  controllers: [SettingsController],
  providers: [PrismaService, SettingsService],
})
export class SettingsModule { }
