import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'http';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

import connectDB from './src/config/db.js';
import authRouter from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import contentRoutes from './src/routes/content.routes.js';
// import upload from './src/routes/upload.route.js';
import initSocket from './src/socket/socket.js';
import paymentRoutes from './src/routes/payment.routes.js';
import webhookRoute from './src/routes/webhook.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRoutes);
// app.use('/api', upload);
app.use('/api/content', contentRoutes);
app.use("/api/subscription", paymentRoutes);
app.use('/webhook', express.raw({ type: 'application/json' }), webhookRoute);


// Optional: Serve static uploads
// app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.use(express.static(path.join(__dirname, './frontend/dist')));

app.get("/*splat", (req, res) => {
    return res.sendFile(path.join(__dirname, './frontend/dist/index.html'));
});

initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
