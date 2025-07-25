# IGT MERN Project

This is a full-stack web application built with the **MERN stack**: **MongoDB**, **Express.js**, **React**, and **Node.js**. The project features robust user authentication with **role-based access control**, user and content management, and Stripe payment integration. The frontend is built with React (Vite + TypeScript) and styled using Tailwind CSS. The backend is structured for scalability and security.

---

## Features

- **Role-Based Authentication:**  
  Users can log in with different roles (e.g., admin, user). Access to features and pages is controlled based on user roles.

- **User Management:**  
  Admins can view, edit, and delete users. (No profile picture upload.)

- **Content Management:**  
  Create, edit, and delete content. Content can include media files.

- **Stripe Payment Integration:**  
  Secure payment flows using Stripe.

- **Google OAuth Support:**  
  Users can log in using Google accounts.

- **Responsive UI:**  
  Built with Tailwind CSS for modern, mobile-friendly design.

- **API Integration:**  
  Uses Axios for HTTP requests and React Query for data fetching and caching.

- **Form Handling:**  
  Uses React Hook Form for robust and scalable form management.

- **Notifications:**  
  Toast notifications for user feedback.

---

## Folder Structure

```
IGT/
├── backend/
│   ├── controllers/         # Express route controllers (auth, users, content, etc.)
│   ├── middleware/          # Middleware (auth, role checks, error handling)
│   ├── models/              # Mongoose models (User, Content, etc.)
│   ├── routes/              # Express route definitions
│   ├── utils/               # Utility functions (JWT, etc.)
│   ├── app.js               # Express app setup
│   ├── server.js            # Backend entry point
│   └── .env.example         # Backend environment variables example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/             # API request functions (auth, content, users)
│   │   ├── components/      # Reusable React components (Layout, Loading, etc.)
│   │   ├── pages/           # Main pages (Content, Users, Auth, etc.)
│   │   ├── utils/           # Utility functions (e.g., useReactQuery, axios instance)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   ├── .env.example         # Frontend environment variables example
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── README.md                # Project documentation (this file)
└── package.json             # Root package.json (if using workspaces)
```

---

## Environment Variables

### Backend (`backend/.env`)
```
# Environment
NODE_ENV=development
PORT=3001

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true

# JWT
JWT_SECRET=your_jwt_secret

# CORS
CORS_ORIGIN=http://localhost:5173

# Nodemailer
NODEMAILER_EMAIL=your_email@gmail.com
NODEMAILER_PASSWORD=your_email_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# LLaMA3 / Ollama Server
LLAMA3_URL=http://localhost:11434

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRICE_ID=your_stripe_price_id

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

```

### Frontend (`frontend/.env`)
```
# API Base URL
VITE_API_URL=http://localhost:3001/api

# Stripe Public Key
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

```

---

## Main Libraries Used

### Backend
- **Express.js** (server framework)
- **Mongoose** (MongoDB ODM)
- **jsonwebtoken** (JWT authentication)
- **bcryptjs** (password hashing)
- **dotenv** (environment variables)
- **Stripe** (payments)
- **Cloudnary** (file upload)
- **Multer** (file handeling)

### Frontend
- **React** (with Vite)
- **TypeScript**
- **Tailwind CSS**
- **Axios** (API requests)
- **React Query** (`@tanstack/react-query`)
- **React Hook Form**
- **React Toastify** (notifications)
- **@headlessui/react** (modals/dialogs)
- **Stripe.js** (payments)

---

## How to Run

### 1. Clone the repository
```sh
git clone https://github.com/Vikrant-cloud/IGT
cd IGT
```

### 2. Setup Backend
```sh
cd backend
cp .env.example .env
# Fill in your environment variables in .env
npm install
npm run dev
```

### 3. Setup Frontend
```sh
cd frontend
cp .env.example .env
# Fill in your environment variables in .env
npm install
npm run dev
```

### 4. Access the App
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3001/api](http://localhost:3001/api)

---

## Usage

- **Role-Based Login:**  
  Users log in and are assigned roles (e.g., admin, user). Access to certain pages and actions is restricted based on role.

- **User Management:**  
  Admins can view, edit, and delete users. No profile picture upload is included.

- **Content Management:**  
  Create, edit, and delete content. Media upload is supported for content.

- **Authentication:**  
  Login with Google OAuth or email/password (if supported by backend).

- **Payments:**  
  Stripe integration for payment flows.

---

## Notes

- All API endpoints are configured via the `VITE_API_URL` environment variable.
- File uploads (for content media) use `multipart/form-data`.
- The project uses modular and reusable components for scalability.
- Make sure MongoDB is running and accessible.
- Role-based access is enforced both on the backend (middleware) and frontend (conditional rendering/routes).

---

## License

This project is for educational/demo purposes.
