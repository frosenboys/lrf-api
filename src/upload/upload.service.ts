import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import * as fs from 'fs';
import * as path from 'path';
import defaultSlugify from 'slugify';

@Injectable()
export class UploadService {

  // Helper: Create a sanitized filename
  private sanitizeFilename(originalname: string): string {
    const parts = originalname.split('.');
    const ext = parts.pop();
    const name = parts.join('.');
    const slugName = defaultSlugify(name, { lower: true, strict: true });
    return `${slugName}-${Date.now()}.${ext}`;
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    if (!file) throw new BadRequestException('File not found');

    // 1. Classify file
    const isImage = file.mimetype.startsWith('image/');

    // ==========================================
    // CASE 1: IF IMAGE -> UPLOAD TO CLOUDINARY
    // ==========================================
    if (isImage) {
      return new Promise((resolve, reject) => {
        const publicId = defaultSlugify(file.originalname.split('.')[0], { lower: true, strict: true });

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'lrf_uploads',
            resource_type: 'image',
            public_id: publicId,
            unique_filename: true,
          },
          (error, result) => {
            if (!result) return reject(new BadRequestException('Lỗi không xác định từ Cloudinary'));
            if (error) return reject(error);
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              type: 'IMAGE'
            });
          },
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    }

    // ==========================================
    // CASE 2: IF DOCUMENT -> SAVE LOCAL
    // ==========================================
    else {
      // a. Create upload directory path (project_root/uploads)
      const uploadDir = path.join(process.cwd(), 'uploads');

      // b. If directory does not exist, create it
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // c. Create a sanitized filename
      const filename = this.sanitizeFilename(file.originalname);
      const filePath = path.join(uploadDir, filename);

      // d. Write file from Buffer to disk
      try {
        await fs.promises.writeFile(filePath, file.buffer);

        // e. Return access URL
        // Link will be: http://localhost:3000/uploads/filename.ext
        const appUrl = process.env.APP_URL || 'http://localhost:3000';
        const fileUrl = `${appUrl}/uploads/${filename}`;

        return {
          url: fileUrl,
          publicId: filename, // For local files, publicId is the filename
          type: 'DOCUMENT'
        };
      } catch (error) {
        throw new BadRequestException('Lỗi khi lưu file: ' + error.message);
      }
    }
  }
}