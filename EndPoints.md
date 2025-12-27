# API Endpoints

Base URL: `http://localhost:3000`

## 1. Authentication
Manage admin sessions.

### **Login**
`POST /auth/login`
* **Access:** Public
* **Body:**
    ```json
    {
      "email": "admin@lrf.org.vn",
      "password": "Admin@123"
    }
    ```
* **Response:**
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### **Get Profile**
`GET /auth/profile`
* **Access:** Admin (Bearer Token)
* **Response:**
    ```json
    {
      "id": "uuid-admin-1",
      "email": "admin@lrf.org.vn",
      "fullName": "Super Admin",
      "role": "SUPER_ADMIN"
    }
    ```

---

## 2. System Settings
Manage general website configuration.

### **Get Settings**
`GET /settings`
* **Access:** Public
* **Response:**
    ```json
    {
      "siteName": "Little Roses Foundation",
      "contactEmail": "contact@lrf.org.vn",
      "options": {
        "facebook": "[https://facebook.com/lrf](https://facebook.com/lrf)",
        "youtube": "[https://youtube.com/lrf](https://youtube.com/lrf)"
      }
    }
    ```

### **Update Settings**
`PATCH /settings`
* **Access:** Admin
* **Body:**
    ```json
    {
      "siteName": "LRF 2025",
      "contactEmail": "new-email@lrf.org.vn",
      "options": {
        "facebook": "[https://facebook.com/new-link](https://facebook.com/new-link)",
        "maintenanceMode": false
      }
    }
    ```

---

## 3. Categories
Manage categories for Projects and Posts.

### **Get Categories**
`GET /categories`
* **Access:** Public
* **Query:** `?type=PROJECT` or `?type=POST`
* **Response:**
    ```json
    [
      {
        "id": "uuid-cat-1",
        "name": "Education",
        "slug": "education",
        "type": "PROJECT"
      }
    ]
    ```

### **Create Category**
`POST /categories`
* **Access:** Admin
* **Body:**
    ```json
    {
      "name": "Medical Support",
      "type": "PROJECT",
      "description": "Support for hospitals"
    }
    ```

### **Update Category**
`PATCH /categories/:id`
* **Access:** Admin
* **Body:**
    ```json
    {
      "name": "Medical & Health Support",
      "description": "Updated description..."
    }
    ```

### **Delete Category**
`DELETE /categories/:id`
* **Access:** Admin
* **Response:**
    ```json
    {
      "message": "Category deleted successfully"
    }
    ```

---

## 4. Projects
Manage charity campaigns.

### **Get Projects List**
`GET /projects`
* **Access:** Public
* **Query:** `?page=1&limit=10&status=ACTIVE`
* **Response:**
    ```json
    {
      "data": [
        {
          "id": "uuid-project-1",
          "title": "Education Support 2025",
          "currentAmount": 12500000,
          "targetAmount": 50000000,
          "status": "ACTIVE"
        }
      ],
      "meta": { "total": 1, "page": 1 }
    }
    ```

### **Get Project Detail**
`GET /projects/:slug`
* **Access:** Public
* **Response:**
    ```json
    {
      "id": "uuid-project-1",
      "title": "Education Support 2025",
      "content": "<p>HTML Content...</p>",
      "targetAmount": 50000000,
      "currentAmount": 12500000,
      "images": [
        { "imageUrl": "url1.jpg", "caption": "Activity 1" }
      ],
      "category": { "name": "Education" }
    }
    ```

### **Create Project**
`POST /projects`
* **Access:** Admin
* **Body:**
    ```json
    {
      "title": "Winter Charity",
      "targetAmount": 20000000,
      "categoryId": "uuid-cat-1",
      "images": [
        { "imageUrl": "url1.jpg", "isFeatured": true }
      ]
    }
    ```

### **Update Project**
`PATCH /projects/:id`
* **Access:** Admin
* **Description:** Update info OR Hide project (Soft delete).
* **Body (Update Info):** `{ "title": "New Title" }`
* **Body (Hide Project):** `{ "status": "PAUSED" }`

### **Delete Project**
`DELETE /projects/:id`
* **Access:** Admin (Hard Delete)

---

## 5. Donations
Handle donations and automated payments.

### **Create Donation (Get QR)**
`POST /donations`
* **Access:** Public
* **Body:**
    ```json
    {
      "amount": 50000,
      "projectId": "uuid-project-1",
      "donorName": "Nguyen Van A",
      "message": "Support"
    }
    ```
* **Response:**
    ```json
    {
      "paymentCode": "LRF839120",
      "qrUrl": "[https://img.vietqr.io/image/MB-9999](https://img.vietqr.io/image/MB-9999)..."
    }
    ```

### **SePay Webhook**
`POST /donations/sepay-webhook`
* **Access:** SePay System Only

### **Get Transparency List**
`GET /donations`
* **Access:** Public
* **Query:** `?projectId=uuid-project-1`
* **Response:**
    ```json
    [
      {
        "donorName": "Nguyen Van A",
        "amount": 50000,
        "verifiedAt": "2025-12-20T10:00:00Z"
      }
    ]
    ```

### **Get Donation Stats**
`GET /donations/stats`
* **Access:** Public
* **Response:** `{ "totalAmount": 150000000, "totalDonors": 340 }`

---

## 6. Posts (News & Documents)

### **Get Posts List**
`GET /posts`
* **Access:** Public
* **Query:** `?categoryId=uuid-cat-news`
* **Response:** `[{ "id": "1", "title": "News Title", "slug": "news-title" }]`

### **Get Post Detail**
`GET /posts/:slug`
* **Access:** Public
* **Response:**
    ```json
    {
      "id": "uuid-post-1",
      "title": "News Title",
      "content": "HTML...",
      "downloadCount": 150,
      "attachmentUrl": "[https://example.com/file.pdf](https://example.com/file.pdf)"
    }
    ```

### **Create Post**
`POST /posts`
* **Access:** Admin
* **Body:** `{ "title": "New Event", "content": "..." }`

### **Update Post**
`PATCH /posts/:id`
* **Access:** Admin
* **Body (Unpublish):** `{ "isPublished": false }`

### **Download Document**
`POST /posts/:id/download`
* **Access:** Public
* **Response:** `{ "url": "...", "downloadCount": 151 }`

---

## 7. Volunteers

### **Register Volunteer**
`POST /volunteers`
* **Access:** Public
* **Body:**
    ```json
    {
      "fullName": "Le Van C",
      "email": "c@gmail.com",
      "projectId": "uuid-project-1"
    }
    ```

### **Get Volunteer List**
`GET /volunteers`
* **Access:** Admin
* **Query:** `?projectId=...&status=PENDING`

### **Approve Volunteer**
`PATCH /volunteers/:id`
* **Access:** Admin
* **Body:** `{ "status": "APPROVED" }`

---

## 8. Contacts

### **Send Contact**
`POST /contacts`
* **Access:** Public
* **Body:** `{ "email": "a@b.com", "message": "Hello" }`

### **Get Contact List**
`GET /contacts`
* **Access:** Admin
* **Query:** `?status=NEW`

### **Update Contact Status**
`PATCH /contacts/:id`
* **Access:** Admin
* **Body:**
    ```json
    {
      "status": "REPLIED",
      "replyMessage": "Sent email."
    }
    ```

---

## 9. Upload

### **Upload File**
`POST /upload`
* **Access:** Admin
* **Content-Type:** `multipart/form-data`
* **Body:** `file` (Binary)
* **Response:**
    ```json
    {
      "url": "[https://res.cloudinary.com/lrf/image/upload/v1/img.jpg](https://res.cloudinary.com/lrf/image/upload/v1/img.jpg)"
    }
    ```

---

## 10. Users (Admin Management)
**(Super Admin Only)**

### **Get Admin List**
`GET /users`
* **Access:** Admin
* **Response:** `[{ "email": "admin@lrf.org", "role": "EDITOR" }]`

### **Create New Admin**
`POST /users`
* **Access:** Super Admin
* **Body:**
    ```json
    {
      "email": "new@lrf.org",
      "password": "Password123",
      "role": "EDITOR"
    }
    ```

### **Update Admin**
`PATCH /users/:id`
* **Access:** Super Admin
* **Body (Block):** `{ "isActive": false }`
* **Body (Reset Pass):** `{ "password": "NewPass" }`

### **Delete Admin**
`DELETE /users/:id`
* **Access:** Super Admin