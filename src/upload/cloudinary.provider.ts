import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from 'src/prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  inject: [PrismaService],

  useFactory: async (prisma: PrismaService) => {
    const setting = await prisma.systemSetting.findUnique({
      where: { id: 1 },
    });
    if (!setting) {
      throw new InternalServerErrorException('System settings not found');
    }

    return cloudinary.config({
      cloud_name: setting.CloudinaryName,
      api_key: setting.CloudinaryAPIKey,
      api_secret: setting.CloudinaryAPISecret,
    });
  },
};