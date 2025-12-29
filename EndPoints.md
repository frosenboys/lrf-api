# Little Roses Foundation (LRF) — API Reference (Bodies & Responses)

Base URL: http://localhost:3000

Note: "Access" shows required guard/role. "AtGuard" = access token required. "RtGuard" = refresh token required.

---

## App
GET /
- Access: Public
- Response 200:
```json
{ "message": "Welcome" }
```

---

## Auth

POST /auth/login
- Access: Public
- Request Body (application/json):
```json
{
  "email": "admin@lrf.org.vn",
  "password": "securePassword123"
}
```
- Response 200:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "user": {
    "id": 1,
    "email": "admin@lrf.org.vn",
    "fullName": "Super Admin",
    "role": "SUPER_ADMIN",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

POST /auth/refresh
- Access: RtGuard (Authorization: Bearer &lt;refreshToken&gt;)
- Request Body: none
- Response 200:
```json
{
  "accessToken": "new_access_token_eyJhbGci...",
  "refreshToken": "new_refresh_token_xyz..."
}
```

POST /auth/logout
- Access: AtGuard
- Request Body: none
- Response 200:
```json
{ "message": "Logged out successfully" }
```

GET /auth/profile
- Access: AtGuard
- Request Body: none
- Response 200:
```json
{
  "id": 1,
  "email": "admin@lrf.org.vn",
  "fullName": "Super Admin",
  "role": "SUPER_ADMIN",
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

## Settings

GET /settings
- Access: Public
- Response 200:
```json
{
  "id": 1,
  "siteName": "Little Roses Foundation",
  "options": {
    "bankName": "MB",
    "bankBin": "970422",
    "bankAccount": "999988886666",
    "bankOwner": "QUY BONG HONG NHO",
    "qrTemplate": "compact2",
    "hotline": "1900 6868",
    "email": "contact@lrf.org.vn",
    "address": "Bitexco Financial Tower, HCMC"
  },
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

PATCH /settings
- Access: SUPER_ADMIN
- Request Body (application/json) — partial fields allowed:
```json
{
  "siteName": "Little Roses Foundation 2025",
  "options": {
    "bankName": "VIETCOMBANK",
    "bankAccount": "1234567890",
    "hotline": "0909000111"
  }
}
```
- Response 200: updated settings object (example)
```json
{
  "id": 1,
  "siteName": "Little Roses Foundation 2025",
  "options": {
    "bankName": "VIETCOMBANK",
    "bankBin": "970422",
    "bankAccount": "1234567890",
    "bankOwner": "QUY BONG HONG NHO",
    "qrTemplate": "compact2",
    "hotline": "0909000111",
    "email": "contact@lrf.org.vn",
    "address": "Bitexco Financial Tower, HCMC"
  },
  "updatedAt": "2025-12-29T00:00:00.000Z"
}
```

---

## Categories

GET /categories
- Access: Public
- Query params: ?type=PROJECT|POST (optional)
- Response 200:
```json
[
  {
    "id": 1,
    "name": "Education",
    "slug": "education",
    "type": "PROJECT",
    "description": "Building schools and libraries.",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

GET /categories/:slug
- Access: Public
- Response 200:
```json
{
  "id": 1,
  "name": "Education",
  "slug": "education",
  "type": "PROJECT",
  "description": "Building schools and libraries.",
  "isActive": true,
  "projects": [
    { "id": 1, "title": "Build a school in Ha Giang", "slug": "build-school-ha-giang" }
  ]
}
```

POST /categories
- Access: MODERATOR
- Request Body:
```json
{
  "name": "Emergency Relief",
  "type": "PROJECT",
  "description": "Flood and storm relief activities."
}
```
- Response 201:
```json
{
  "id": 5,
  "name": "Emergency Relief",
  "slug": "emergency-relief",
  "type": "PROJECT",
  "description": "Flood and storm relief activities.",
  "isActive": true,
  "createdAt": "2025-12-29T00:00:00.000Z"
}
```

PATCH /categories/:id
- Access: MODERATOR
- Request Body (partial):
```json
{ "name": "Emergency & Relief", "isActive": false }
```
- Response 200: updated category object

DELETE /categories/:id
- Access: MODERATOR
- Response 200:
```json
{ "id": 5, "name": "Emergency & Relief", "deleted": true }
```

---

## Projects

GET /projects
- Access: Public
- Query params: ?page=1&limit=10&status=ACTIVE|COMPLETED|PAUSED&categoryId=1
- Response 200:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Build a school in Ha Giang",
      "slug": "build-school-ha-giang",
      "p_name": "BSHG",
      "summary": "Building 3 new classrooms...",
      "thumbnailUrl": "https://res.cloudinary.com/.../thumb.jpg",
      "targetAmount": 500000000,
      "currentAmount": 125000000,
      "status": "ACTIVE",
      "isUrgent": false,
      "category": { "id": 1, "name": "Education", "slug": "education" },
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "meta": { "total": 15, "page": 1, "limit": 10, "lastPage": 2 }
}
```

GET /projects/:slug
- Access: Public
- Response 200:
```json
{
  "id": 1,
  "title": "Build a school in Ha Giang",
  "slug": "build-school-ha-giang",
  "p_name": "BSHG",
  "summary": "Building 3 new classrooms...",
  "content": "<p>Full HTML content...</p>",
  "thumbnailUrl": "https://res.cloudinary.com/.../thumb.jpg",
  "documentUrl": "https://res.cloudinary.com/.../doc.pdf",
  "targetAmount": 500000000,
  "currentAmount": 125000000,
  "status": "ACTIVE",
  "isUrgent": false,
  "category": { "id": 1, "name": "Education", "slug": "education" },
  "images": [ { "imageUrl": "https://...", "caption": "Groundbreaking ceremony" } ],
  "donations": [
    { "donorName": "Hidden Donor", "amount": 500000, "message": "Good luck", "createdAt": "2025-01-01T10:00:00.000Z" }
  ],
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

POST /projects
- Access: MODERATOR
- Request Body:
```json
{
  "title": "New School Project 2025",
  "p_name": "NSP25",
  "summary": "Short summary...",
  "content": "<p>Detailed HTML content...</p>",
  "thumbnailUrl": "https://image.url/thumb.jpg",
  "documentUrl": "https://image.url/doc.pdf",
  "targetAmount": 200000000,
  "categoryId": 1,
  "isUrgent": true
}
```
- Response 201:
```json
{
  "id": 12,
  "title": "New School Project 2025",
  "slug": "new-school-project-2025",
  "p_name": "NSP25",
  "summary": "Short summary...",
  "thumbnailUrl": "https://image.url/thumb.jpg",
  "targetAmount": 200000000,
  "currentAmount": 0,
  "status": "ACTIVE",
  "isUrgent": true,
  "categoryId": 1,
  "createdAt": "2025-12-29T00:00:00.000Z"
}
```

PATCH /projects/:id
- Access: MODERATOR
- Request Body (partial):
```json
{ "title": "Updated Title", "status": "PAUSED", "isUrgent": false }
```
- Response 200: updated project object

DELETE /projects/:id
- Access: MODERATOR
- Response 200:
```json
{ "id": 12, "title": "New School Project 2025", "deleted": true }
```

---

## Donations

GET /donations/banks
- Access: Public
- Response 200:
```json
{
  "code": "00",
  "data": [
    { "id": "970422", "name": "MB - Military Bank", "code": "MB", "bin": "970422" },
    { "id": "970436", "name": "Vietcombank", "code": "VCB", "bin": "970436" }
  ]
}
```

GET /donations/qr/:slug
- Access: Public
- Response 200:
```json
{
  "qrUrl": "https://img.vietqr.io/image/MB-99998888-compact2.png?addInfo=BSHG%201",
  "transferContent": "BSHG 1",
  "projectTitle": "Build a school in Ha Giang",
  "bankInfo": {
    "bankName": "MB",
    "bankBin": "970422",
    "accountNo": "99998888",
    "accountName": "QUY BONG HONG NHO",
    "qrTemplate": "compact2"
  }
}
```

GET /donations/:slug
- Access: Public
- Query: ?projectId=1 (optional)
- Response 200:
```json
[
  {
    "id": 99123,
    "projectId": 1,
    "donorName": "Nguyễn Văn A",
    "message": "Chúc các cháu học giỏi",
    "amount": 500000,
    "paymentCode": "SP_123456",
    "gateway": "MB",
    "gatewayTransactionId": "BANK_TX_001",
    "status": "SUCCESS",
    "createdAt": "2025-01-01T10:00:00.000Z"
  }
]
```

POST /donations/webhook
- Access: Public (SePay system sends)
- Request Body (example sepay payload):
```json
{
  "id": 99123,
  "gateway": "MB",
  "transactionDate": "2025-01-01 10:00:00",
  "accountNumber": "99998888",
  "content": "BSHG 1 ung ho cac em",
  "transferType": "in",
  "transferAmount": 500000,
  "code": "SP_123456"
}
```
- Response 200:
```json
{ "success": true }
```

---

## Posts

GET /posts
- Access: Public
- Query: ?type=NEWS|DOCUMENT|STORY|ACTIVITY&categoryId=&projectId=&page=&limit=
- Response 200:
```json
[
  {
    "id": 1,
    "title": "Annual Report 2024",
    "slug": "annual-report-2024",
    "type": "DOCUMENT",
    "summary": "Financial report...",
    "thumbnailUrl": "https://cloudinary.../thumb.jpg",
    "attachmentUrl": "https://cloudinary.../report.pdf",
    "downloadCount": 120,
    "isPublished": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

GET /posts/:slug
- Access: Public
- Response 200:
```json
{
  "id": 1,
  "title": "Annual Report 2024",
  "slug": "annual-report-2024",
  "type": "DOCUMENT",
  "summary": "Financial report...",
  "content": "<p>Full HTML content</p>",
  "thumbnailUrl": "https://cloudinary.../thumb.jpg",
  "attachmentUrl": "https://cloudinary.../report.pdf",
  "downloadCount": 120,
  "isPublished": true,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

POST /posts
- Access: MODERATOR
- Request Body:
```json
{
  "title": "New Article",
  "summary": "Short summary...",
  "content": "<p>HTML content...</p>",
  "thumbnailUrl": "https://...",
  "attachmentUrl": "https://...",
  "type": "NEWS",
  "categoryId": 2,
  "projectId": 1,
  "isPublished": true
}
```
- Response 201:
```json
{
  "id": 10,
  "title": "New Article",
  "slug": "new-article",
  "type": "NEWS",
  "isPublished": true,
  "createdAt": "2025-12-29T00:00:00.000Z"
}
```

PATCH /posts/:id
- Access: MODERATOR
- Request Body (partial):
```json
{ "title": "Updated Title", "isPublished": false }
```
- Response 200: updated post object

DELETE /posts/:id
- Access: MODERATOR
- Response 200:
```json { "id": 10, "deleted": true } ```

POST /posts/:id/download
- Access: Public
- Request Body: none
- Response 200:
```json
{ "url": "https://cloudinary.../report.pdf", "fileName": "Annual Report 2024" }
```

---

## Volunteers

POST /volunteers
- Access: Public
- Request Body:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "0909123456",
  "projectId": 1,
  "skills": "Teaching, English",
  "reason": "I want to help children.",
  "dob": "1995-06-20",
  "address": "Ho Chi Minh City"
}
```
- Response 201:
```json
{
  "id": 21,
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "0909123456",
  "projectId": 1,
  "skills": "Teaching, English",
  "reason": "I want to help children.",
  "status": "PENDING",
  "createdAt": "2025-12-29T00:00:00.000Z"
}
```

GET /volunteers
- Access: MODERATOR
- Query: ?projectId=&status=PENDING|APPROVED|REJECTED&page=&limit=
- Response 200:
```json
[
  {
    "id": 21,
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "0909123456",
    "projectId": 1,
    "status": "PENDING",
    "createdAt": "2025-12-29T00:00:00.000Z"
  }
]
```

PATCH /volunteers/:id
- Access: MODERATOR
- Request Body:
```json
{ "status": "APPROVED" }
```
- Response 200: updated volunteer object

DELETE /volunteers/:id
- Access: MODERATOR
- Response 200:
```json { "id": 21, "deleted": true } ```

---

## Contacts

POST /contacts
- Access: Public
- Request Body:
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "a@gmail.com",
  "phone": "0909123456",
  "message": "Tôi muốn liên hệ về chương trình."
}
```
- Response 201:
```json
{
  "id": 101,
  "fullName": "Nguyễn Văn A",
  "email": "a@gmail.com",
  "phone": "0909123456",
  "message": "Tôi muốn liên hệ về chương trình.",
  "status": "NEW",
  "createdAt": "2025-12-29T00:00:00.000Z"
}
```

GET /contacts
- Access: EDITOR
- Query: ?status=NEW|PENDING|REPLIED|RESOLVED&page=&limit=
- Response 200:
```json
[
  {
    "id": 101,
    "fullName": "Nguyễn Văn A",
    "email": "a@gmail.com",
    "phone": "0909123456",
    "message": "Tôi muốn liên hệ về chương trình.",
    "status": "NEW",
    "replyMessage": null,
    "createdAt": "2025-12-29T00:00:00.000Z"
  }
]
```

GET /contacts/:id
- Access: EDITOR
- Response 200: single contact object

PATCH /contacts/:id
- Access: EDITOR
- Request Body:
```json
{ "status": "REPLIED", "replyMessage": "Cảm ơn bạn, chúng tôi sẽ liên hệ sớm." }
```
- Response 200: updated contact object

DELETE /contacts/:id
- Access: EDITOR
- Response 200:
```json { "id": 101, "deleted": true } ```

---

## Upload

POST /upload
- Access: EDITOR|MODERATOR|SUPER_ADMIN
- Content-Type: multipart/form-data (field name: file)
- Response 201:
```json
{
  "url": "https://res.cloudinary.com/lrf/image/upload/v17100000/sample.jpg",
  "publicId": "sample"
}
```

---

## Users (Admin Management)

GET /users
- Access: SUPER_ADMIN
- Response 200:
```json
[
  {
    "id": 1,
    "email": "admin@lrf.org.vn",
    "fullName": "Super Admin",
    "role": "SUPER_ADMIN",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

POST /users
- Access: SUPER_ADMIN
- Request Body:
```json
{
  "email": "editor@lrf.org.vn",
  "password": "Password123!",
  "fullName": "Content Editor",
  "role": "EDITOR"
}
```
- Response 201:
```json
{
  "id": 11,
  "email": "editor@lrf.org.vn",
  "fullName": "Content Editor",
  "role": "EDITOR",
  "isActive": true,
  "createdAt": "2025-12-29T00:00:00.000Z"
}
```

PATCH /users/:id
- Access: SUPER_ADMIN
- Request Body (examples):
```json
{ "isActive": false }
```
or
```json
{ "password": "NewPassword123!" }
```
- Response 200: updated user object

DELETE /users/:id
- Access: SUPER_ADMIN
- Response 200:
```json { "id": 11, "deleted": true } ```

---

## HTTP Status Codes (common)
- 200: OK (returns JSON object/array)
- 201: Created (returns created resource)
- 400: Bad Request (validation errors)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient role)
- 404: Not Found
- 500: Internal Server Error
