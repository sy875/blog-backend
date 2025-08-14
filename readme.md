# 🖋️ Inkwell Blog App

Inkwell Blog App is a **role-based blog platform** built with **Node.js, Express, TypeScript, and MongoDB**.  
It provides **User** and **Admin** access levels, includes **API key-based security**, and implements **rate limiting** to protect the API from abuse.  

You can explore the API endpoints through our [Postman Collection](https://www.postman.com/lively-firefly-527899/workspace/inkwell-blog-app/collection/22923065-2ef3f880-b6fd-452b-a844-dbc741cd2ab1?action=share&source=copy-link&creator=22923065).

---

## ✨ Features
- **Role-based Authentication**:  
  - **User**: Create and manage own posts, comment, view content.  
  - **Admin**: Approve/reject posts, manage all content and users.  
- **Secure API**:  
  - API key validation on protected routes.  
  - JWT-based authentication.  
- **Rate Limiting**: Prevents abuse by limiting requests per IP.  
- **TypeScript** for type safety.  
- **RESTful API** design.

---

## 📂 Tech Stack
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT, API Key
- **Security**: bcrypt, helmet, express-rate-limit, CORS
- **Testing**: Jest, Supertest
- **Dev Tools**: Nodemon, tsc-watch

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd inkwell-blog-app
   npm install
   npm run dev
