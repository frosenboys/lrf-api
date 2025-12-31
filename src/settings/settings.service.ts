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

    const oldOptions = (currentSettings?.metaData as object) || {};

    const mergedOptions = {
      ...oldOptions,
      ...(dto.metaData || {}),
    };

    return this.prisma.systemSetting.upsert({
      where: { id: 1 },
      update: {
        CloudinaryAPIKey: dto.CloudinaryAPIKey,
        CloudinaryAPISecret: dto.CloudinaryAPISecret,
        CloudinaryName: dto.CloudinaryCloudName,

        SepayAPIKey: dto.SepayAPIKey,
        siteName: dto.siteName,
        metaData: mergedOptions,
      },
      create: {
        id: 1,
        CloudinaryAPIKey: dto.CloudinaryAPIKey || '',
        CloudinaryAPISecret: dto.CloudinaryAPISecret || '',
        CloudinaryName: dto.CloudinaryCloudName || '',
        SepayAPIKey: dto.SepayAPIKey || '',
        siteName: dto.siteName || 'Little Roses Foundation',
        metaData: dto.metaData || {},
      },
    });
  }
}