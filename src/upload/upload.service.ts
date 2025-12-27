import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

// Định nghĩa kiểu trả về cho gọn
export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

@Injectable()
export class UploadService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file để upload.');
    }

    // Check file extension (chỉ cho phép ảnh)
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      throw new BadRequestException('Chỉ cho phép upload file ảnh (jpg, jpeg, png, gif, webp).');
    }

    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'little-roses-foundation',
        },
        (error, result) => {
          if (error) return reject(error);

          if (!result) return reject(new BadRequestException('Lỗi upload: Không nhận được phản hồi từ Cloudinary.'));

          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}