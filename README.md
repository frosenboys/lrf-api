# Little Roses Foundation API (Backend)

The Backend API system for **Little Roses Foundation (LRF)** - A Service Learning Project.
Built with **NestJS**, **PostgreSQL**, and integrated with **SePay** for automated donation tracking.

## 🛠 Tech Stack

- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Payment Gateway:** SePay (VietQR Webhook)
- **Storage:** Cloudinary (Images/Files)
---

## 🚀 Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd lrf-api

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

```

### 3. Database Setup

Make sure you have updated `DATABASE_URL` in your `.env` file.

```bash
# Run migrations (Create tables)
npx prisma migrate dev --name init

# Seed database (Create Admin & Sample Data)
npx prisma db seed

```

### 4. Running the App

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

```

* **API Server:** `http://localhost:3000`

---

## 📚 API Endpoints

### 🔐 Authentication

Manage admin sessions.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | Public | Login to CMS. Response: JWT Token. |
| `GET` | `/auth/profile` | **Admin** | Get current logged-in admin info. |

### ⚙️ System Settings

Manage general website configuration (Footer, Contact, Banking Info).

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/settings` | Public | Get public settings (Address, Bank, Socials). |
| `PATCH` | `/settings` | **Admin** | Update system settings. |

### 📂 Categories

Manage categories for Projects and Posts.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/categories` | Public | List categories. Query: `?type=PROJECT` or `?type=POST`. |
| `POST` | `/categories` | **Admin** | Create a new category. |
| `PATCH` | `/categories/:id` | **Admin** | Update a category. |
| `DELETE` | `/categories/:id` | **Admin** | Delete a category. |

### 🚀 Projects

Manage charity campaigns and fundraising progress.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/projects` | Public | List projects (Pagination). Query: `?status=ACTIVE`. |
| `GET` | `/projects/:slug` | Public | Get project details & image gallery. |
| `POST` | `/projects` | **Admin** | Create a new project. |
| `PATCH` | `/projects/:id` | **Admin** | Update project details. |
| `DELETE` | `/projects/:id` | **Admin** | Delete (or soft delete) a project. |

### 💰 Donations & SePay (Core Feature)

Handle donations and automated payment verification.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/donations` | Public | Create donation request. Response: `paymentCode` & `qrUrl`. |
| `POST` | `/donations/sepay-webhook` | **SePay** | **Webhook:** Receive data from SePay -> Verify -> Add funds to Project. |
| `GET` | `/donations` | Public | Transparency List (Only shows `VERIFIED` donations). |
| `GET` | `/donations/stats` | Public | Get total donation amount & donor count. |
| `GET` | `/admin/donations` | **Admin** | Transaction History (View PENDING, CANCELLED). |
| `PATCH` | `/admin/donations/:id/verify` | **Admin** | Manual Approve (For Cash payments). |

### 📰 Posts (News & Documents)

Manage news, stories, and financial reports.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/posts` | Public | List posts. Query: `?categoryId=...`. |
| `GET` | `/posts/:slug` | Public | Get post details. |
| `POST` | `/posts/:id/download` | Public | **Counter:** Return file URL & increment `downloadCount`. |
| `POST` | `/posts` | **Admin** | Create a post/document. |
| `PATCH` | `/posts/:id` | **Admin** | Edit a post. |
| `DELETE` | `/posts/:id` | **Admin** | Delete a post. |

### 🤝 Volunteers

Manage volunteer registrations.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/volunteers` | Public | Register as a volunteer for a project. |
| `GET` | `/volunteers` | **Admin** | View applicants. Query: `?status=PENDING`. |
| `PATCH` | `/volunteers/:id` | **Admin** | Approve (`APPROVED`) or Reject application. |

### 📩 Contacts

Manage user inquiries.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/contacts` | Public | Send a contact message. |
| `GET` | `/contacts` | **Admin** | View all messages. |
| `PATCH` | `/contacts/:id` | **Admin** | Update status (e.g., REPLIED). |

### ☁️ Upload

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/upload` | **Admin** | Upload file to Cloudinary. Response: `{ url }`. |

### 👤 Users (Internal)

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/users` | **Admin** | List all admins. |
| `POST` | `/users` | **Super** | Create a new Admin. |
| `PATCH` | `/users/:id` | **Super** | Disable/Enable account. |
| `DELETE` | `/users/:id` | **Super** | Delete account. |

---

## 🗄 Database Schema (ERD)

The system is built upon the following key models:

1. **SystemSetting:** Singleton configuration for dynamic website info.
2. **Category:** Shared categories for Projects and Posts.
3. **Project:** Charity projects (linked to `ProjectImage` for gallery).
4. **Donation:** Financial transactions (linked to `paymentCode` for SePay tracking).
5. **Post:** News & Documents (with download tracking).
6. **Volunteer:** Volunteer applications per project.
7. **Contact:** User inquiries.
8. **Admin:** CMS users.

```