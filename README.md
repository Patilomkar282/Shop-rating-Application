Store Rating Application

A full-stack role-based Store Rating Web Application developed as part of the FullStack Intern Coding Challenge. The platform allows users to register, log in, browse stores, and submit ratings, while administrators and store owners have access to dedicated dashboards and management functionalities.

🚀 Features
🔐 Authentication & Authorization
JWT-based authentication
Role-based access control
Secure password hashing using bcrypt
Protected frontend and backend routes
Update password functionality
Single login system for all users
👥 User Roles
1️⃣ System Administrator
Add new users
Add new stores
Manage admin, users, and store owners
View dashboard statistics:
Total Users
Total Stores
Total Ratings
View all users and stores
Filter and sort users/stores
View store ratings
Logout functionality
2️⃣ Normal User
User registration and login
Browse all registered stores
Search stores by name and address
Submit ratings (1–5)
Modify submitted ratings
View overall store ratings
Update password
Logout functionality
3️⃣ Store Owner
Login to platform
View average store rating
View users who rated their store
Update password
Logout functionality
🛠️ Tech Stack
Frontend
React.js
Tailwind CSS
Axios
React Router DOM
Backend
Node.js
Express.js
JWT Authentication
bcryptjs
Database
MySQL2
📂 Project Structure
Store-Rating-Application/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
🗄️ Database Schema
Users Table
id
name
email
password
address
role
Stores Table
id
name
email
address
owner_id
Ratings Table
id
user_id
store_id
rating
✅ Form Validations
Name: Minimum 20 characters, Maximum 60 characters
Address: Maximum 400 characters
Password:
8–16 characters
At least one uppercase letter
At least one special character
Email validation using standard regex
📊 Main Functionalities
Role-based dashboards
Store rating system
Dynamic average rating calculation
Search, filter, and sorting
Responsive UI design
Secure authentication flow
RESTful API architecture
⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/your-username/Store-Rating-Application.git
2️⃣ Backend Setup
cd backend
npm install

Create .env file:

PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=rating_db

JWT_SECRET=your_jwt_secret

Run backend:

npm start
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
🔑 Default Roles
ADMIN
USER
STORE_OWNER
📌 API Modules
Authentication
POST /api/auth/signup
POST /api/auth/login
PUT  /api/auth/update-password
Admin
GET  /api/admin/dashboard
POST /api/admin/users
POST /api/admin/stores
GET  /api/admin/users
GET  /api/admin/stores
User
GET  /api/user/stores
POST /api/user/rating
PUT  /api/user/rating/:id
Store Owner
GET /api/owner/dashboard
GET /api/owner/ratings
🔒 Security Features
JWT token authentication
Password hashing using bcrypt
Role-based authorization middleware
Protected APIs
Input validations
SQL injection prevention using parameterized queries
📱 UI Features
Fully responsive design
Modern dashboard layout
Sidebar navigation
Table sorting and filtering
Clean user experience
🎯 Challenge Requirements Covered

✅ Role-based authentication
✅ Admin dashboard
✅ Store management
✅ User management
✅ Store rating system
✅ Rating modification
✅ Search and filter
✅ Sorting functionality
✅ Password update
✅ MySQL database integration
✅ Responsive frontend
✅ Secure backend APIs
