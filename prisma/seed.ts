import { PrismaClient, AdminRole, ProjectStatus, PostType, CategoryType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding database...');

  // ===========================================================
  // 1. DỌN DẸP DỮ LIỆU CŨ (Clean up)
  // ===========================================================
  // Xóa theo thứ tự ngược lại của quan hệ (Con xóa trước, Cha xóa sau)
  await prisma.projectImage.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.volunteer.deleteMany();
  await prisma.post.deleteMany();
  await prisma.project.deleteMany();
  await prisma.category.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.admin.deleteMany();

  console.log('🧹 Cleaned up old data.');

  // ===========================================================
  // 2. TẠO ADMIN (Pass: 123456)
  // ===========================================================
  const hashedPassword = await bcrypt.hash('123456', 10);

  await prisma.admin.create({
    data: {
      email: 'admin@lrf.org.vn',
      password: hashedPassword,
      fullName: 'Quản trị viên',
      role: AdminRole.SUPER_ADMIN,
    },
  });

  console.log('👤 Created Admin: admin@lrf.org.vn | 123456');

  // ===========================================================
  // 3. TẠO CẤU HÌNH HỆ THỐNG (Bank)
  // ===========================================================
  await prisma.systemSetting.create({
    data: {
      id: 1, // ID cố định là 1
      siteName: 'Little Roses Foundation',
      bankQRTemplate: 'compact',

      // Cloudinary Config
      CloudinaryName: "dnj8b864i",
      CloudinaryAPIKey: "723859424512621",
      CloudinaryAPISecret: "uz9kEwsOJF9HSsk9m3TkeUg75dk",

      // SEPAY Config
      SepayAPIKey: "ASFDCFSCUYKZCQGST6RHWBU310PZ82K6SLYRV13ROJBMCAMD2OJY5ZNXTJIXRGE0",
      metaData: {
        // Thông tin liên hệ
        hotline: '1900 6868',
        email: 'contact@lrf.org.vn',
        address: 'Tầng 5, Bitexco Financial Tower, Q1, TP.HCM'
      },
    },
  });

  console.log('⚙️  Created System Settings (Bank Info).');

  // ===========================================================
  // 4. TẠO DANH MỤC (CATEGORIES)
  // ===========================================================

  // Lưu biến để lấy ID (vì ID giờ là số tự tăng, ta không biết trước)
  const catGiaoDuc = await prisma.category.create({
    data: {
      name: 'Giáo dục',
      slug: 'giao-duc',
      type: CategoryType.PROJECT,
      description: 'Dự án xây trường, thư viện, học bổng.',
    },
  });

  const catYTe = await prisma.category.create({
    data: {
      name: 'Y tế',
      slug: 'y-te',
      type: CategoryType.PROJECT,
      description: 'Hỗ trợ mổ tim, viện phí cho bệnh nhi.',
    },
  });

  const catCuuTro = await prisma.category.create({
    data: {
      name: 'Cứu trợ khẩn cấp',
      slug: 'cuu-tro',
      type: CategoryType.PROJECT,
      description: 'Hỗ trợ thiên tai, bão lũ.',
    },
  });

  const catTinTuc = await prisma.category.create({
    data: {
      name: 'Tin tức & Sự kiện',
      slug: 'tin-tuc',
      type: CategoryType.POST,
    },
  });

  console.log('📂 Created Categories.');

  // ===========================================================
  // 5. TẠO DỰ ÁN (PROJECTS) - Có p_code
  // ===========================================================

  // Dự án 1: Xây trường
  const project1 = await prisma.project.create({
    data: {
      title: 'Xây điểm trường bản Xéo Thâm - Hà Giang',
      slug: 'xay-truong-xeo-tham',
      p_code: 'XTXTHG', // 👈 Mã viết tắt (Xay Truong Xeo Tham Ha Giang)
      summary: 'Dự án xây mới 3 phòng học kiên cố thay thế lớp học tranh tre nứa lá.',
      content: '<p>Nội dung chi tiết dự án...</p>',
      thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',

      targetAmount: 500000000, // 500 triệu
      currentAmount: 125500000,

      bankName: 'Vietcombank',
      bankBin: '970436',
      bankAccount: '123456789',
      bankOwner: 'Quỹ LRF',

      status: ProjectStatus.ACTIVE,
      isUrgent: true,
      categoryId: catGiaoDuc.id, // Link với ID danh mục Giáo dục

      // Ảnh phụ
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80' },
        ]
      }
    },
  });

  // Dự án 2: Trái tim cho em
  const project2 = await prisma.project.create({
    data: {
      title: 'Trái tim cho em 2025',
      slug: 'trai-tim-cho-em-2025',
      p_code: 'TTCE2025', // 👈 Mã viết tắt (Trai Tim Cho Em 2025)
      summary: 'Tài trợ chi phí phẫu thuật tim bẩm sinh cho 50 em nhỏ.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',

      bankName: 'Vietcombank',
      bankBin: '970436',
      bankAccount: '123456789',
      bankOwner: 'Quỹ LRF',

      targetAmount: 2000000000, // 2 tỷ
      currentAmount: 50000000,

      status: ProjectStatus.ACTIVE,
      categoryId: catYTe.id,
    },
  });

  // Dự án 3: Lũ lụt (Đã xong)
  const project3 = await prisma.project.create({
    data: {
      title: 'Cứu trợ lũ lụt Miền Trung 2024',
      slug: 'cuu-tro-mien-trung-2024',
      p_code: 'MT2024', // 👈 Mã viết tắt
      summary: 'Hỗ trợ áo phao, lương thực cho bà con vùng rốn lũ.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1547619292-240402b5ae5d?auto=format&fit=crop&w=800&q=80',

      bankName: 'Vietcombank',
      bankBin: '970436',
      bankAccount: '123456789',
      bankOwner: 'Quỹ LRF',

      targetAmount: 500000000,
      currentAmount: 550000000, // Đạt 110%

      status: ProjectStatus.COMPLETED,
      categoryId: catCuuTro.id,
    },
  });

  console.log('🚀 Created Projects (XTXTHG, TTCE2025, MT2024).');

  // ===========================================================
  // 6. TẠO QUYÊN GÓP (DONATIONS)
  // ===========================================================

  // 1. Ủng hộ xây trường (Đã xác nhận)
  await prisma.donation.create({
    data: {
      amount: 500000,
      donorName: 'Nguyễn Văn A',
      message: 'Chuc cac chau hoc gioi',
      paymentCode: 'LRF99001', // Mã giao dịch hệ thống
      gatewayTransactionId: 'BANK001',
      projectId: project1.id, // Link vào Project 1
    },
  });

  // 2. Ủng hộ mổ tim (Đang chờ - Pending)
  await prisma.donation.create({
    data: {
      amount: 2000000,
      donorName: 'Trần Thị B',
      message: 'Mong cac em khoe manh',
      paymentCode: 'LRF99002',
      projectId: project2.id,
    },
  });

  // 3. Ủng hộ Quỹ chung (Không chọn dự án)
  await prisma.donation.create({
    data: {
      amount: 100000,
      donorName: 'Ẩn danh',
      message: 'Cua it long nhieu',
      paymentCode: 'LRF99003',
      gatewayTransactionId: 'BANK003',
      // projectId: null -> Mặc định là null
    },
  });

  console.log('💰 Created Donations.');

  // ===========================================================
  // 7. TẠO BÀI VIẾT (POSTS)
  // ===========================================================
  await prisma.post.create({
    data: {
      title: 'Lễ khánh thành điểm trường Xéo Thâm giai đoạn 1',
      slug: 'khanh-thanh-xeo-tham-gd1',
      summary: 'Niềm vui của thầy trò khi có lớp học mới.',
      content: '<p>Nội dung bài viết...</p>',
      thumbnailUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      type: PostType.NEWS,
      categoryId: catTinTuc.id,
      projectId: project1.id, // Bài viết này cập nhật cho dự án 1
      isPublished: true,
    },
  });

  console.log('📰 Created Posts.');
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });