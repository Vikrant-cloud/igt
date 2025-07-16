const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRouter = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const upload = require('./src/routes/upload.route')
const cookieParser = require('cookie-parser')
const path = require('path');
const http = require('http');
const cors = require('cors');
const initSocket = require('./src/socket/socket');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Replace with your frontend URL
    credentials: true // if using cookies or auth headers
}));

initSocket(server)

app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/users', userRoutes);
app.use('/api', upload)
//app.use('/uploads', express.static(path.join(__dirname, "./uploads"))); // Serve static files from the uploads directory

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

