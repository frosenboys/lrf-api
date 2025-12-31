# Little Roses Foundation (LRF) - Backend API

A Backend system for managing charity funds, volunteer projects, and payment gateways, built on the **NestJS** framework and **Prisma** ORM.

## 🛠 Tech Stack

-   **Framework:** NestJS
-   **Language:** TypeScript
-   **Database:** PostgreSQL
-   **ORM:** Prisma
-   **Authentication:** JWT (Access Token + Refresh Token)
-   **Storage (Hybrid):**
    -   Images ➜ **Cloudinary** (Bandwidth optimization, resizing).
    -   Documents (PDF/Doc) ➜ **Local Server** (Security, avoids 401/403 errors).
-   **Payment:** SePay (Automatic bank transfer verification).

---

## 🚀 Key Features

### 1. Authentication & Authorization (Auth & RBAC)
-   **Mechanism:** Dual Token (Access Token 15 min, Refresh Token 7 days).
-   **Roles:**
    -   `SUPER_ADMIN`: Manage users, system settings.
    -   `MODERATOR`: Manage projects, posts, volunteers.
    -   `EDITOR`: Write posts, upload documents.

### 2. File Management (Hybrid Upload System)
The system automatically classifies files based on MimeType:
-   **Images (.jpg, .png):** Uploaded to Cloudinary to generate optimized CDN links.
-   **Documents (.pdf, .docx, .xlsx):** Saved directly to the `uploads/` folder on the server to ensure integrity and support direct downloads.
-   **Download:** Dedicated endpoint `/upload/download/:filename` forces browser download instead of opening a preview.

### 3. Donations
-   **SePay Webhook Integration:** Automatically detects bank transactions via transfer content.
-   **Syntax:** `PROJECT_CODE + CATEGORY_ID` (e.g., `XTXTHG 1`).
-   **API:** Generates standard VietQR transfer codes.

---

## ⚙️ Installation & Configuration

### 1. Initialize Project
```bash
# Clone source code
git clone <repo_url>
cd lrf-api

# Install dependencies
npm install

```

### 2. Environment Configuration (.env)

Create a `.env` file in the root directory and fill in the following information:

```ini
# --- SERVER ---
PORT=3000
APP_URL="http://localhost:3000"  # Change to real domain when deploying

# --- DATABASE ---
DATABASE_URL="postgresql://postgres:password@localhost:5432/lrf_db?schema=public"

# --- JWT (MUST BE DIFFERENT) ---
JWT_ACCESS_SECRET=""
JWT_REFRESH_SECRET=""

# --- CLOUDINARY (Image Storage) ---
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# --- SEPAY (Payment) ---
SEPAY_API_KEY=

```

### 3. Database Migration

```bash
# Sync Prisma Schema
npx prisma migrate dev --name init

# (Optional) Seed sample data
npx prisma db seed

```

### 4. Run Application

```bash
# Development mode (Watch mode)
npm run start:dev

# Production mode
npm run build
npm run start:prod

```

---

## 📂 Folder Structure

```
lrf-api/
├── dist/
├── src/
│   ├── auth/           # Login, Register, Guards
│   ├── upload/         # Hybrid Upload Logic
│   ├── donations/      # SePay Webhook
│   └── ...
├── uploads/            # 👈 Folder containing PDF/Doc files (Created at runtime)
├── prisma/
├── .env
└── package.json

```
## 📖 API Documentation

👉 **[View Full API Documentation](./EndPoints.md)**
