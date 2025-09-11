import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'http';
import cors from 'cors';

import connectDB from './src/config/db.js';
import authRouter from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import contentRoutes from './src/routes/content.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';
import messageRoutes from './src/routes/message.route.js'
import webhookRoute from './src/routes/webhook.js';
import initSocket from './src/socket/socket.js';
import { notFound, errorHandler } from './src/middlewares/errorMiddleware.js';
import { serveFrontend } from './src/utils/serveFrontend.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Stripe Webhook
app.use('/webhook', express.raw({ type: 'application/json' }), webhookRoute);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/subscription', paymentRoutes);
app.use('/api/messages', messageRoutes);

// Serve Frontend (Vite build)
serveFrontend(app);

// Global Error Handlers
app.use(notFound);
app.use(errorHandler);

// Initialize Socket.IO
initSocket(server);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
