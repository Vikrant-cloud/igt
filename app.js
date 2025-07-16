import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'http';
import cors from 'cors';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

import connectDB from './src/config/db.js';
import authRouter from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import upload from './src/routes/upload.route.js';
import initSocket from './src/socket/socket.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// // For __dirname in ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRoutes);
app.use('/api', upload);

// Optional: Serve static uploads
// app.use('/uploads', express.static(path.join(__dirname, './uploads')));

initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
