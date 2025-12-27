import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) { }

  async getSettings() {
    return this.prisma.systemSetting.findUnique({
      where: { id: 1 },
    });
  }

  async update(dto: UpdateSettingDto) {
    const currentSettings = await this.prisma.systemSetting.findUnique({
      where: { id: 1 },
    });

    const oldOptions = (currentSettings?.options as object) || {};

    const mergedOptions = {
      ...oldOptions,
      ...(dto.options || {}),
    };

    return this.prisma.systemSetting.upsert({
      where: { id: 1 },
      update: {
        siteName: dto.siteName,
        options: mergedOptions,
      },
      create: {
        id: 1,
        siteName: dto.siteName || 'Little Roses Foundation',
        options: dto.options || {},
      },
    });
  }
}