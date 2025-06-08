import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from 'http';
import { authController } from './controllers/auth/authUtilityController.js';

import adminAuthRoutes from './routes/auth/adminAuthRoutes.js';
import employeeAuthRoutes from './routes/auth/employeeAuthRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import applicantRoutes from './routes/applicantRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import { pool } from './config/database.js';
import { startWebSocketServer } from './websocketServer.js';
import { checkConnection } from './config/database.js';


checkConnection();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app); // For WebSocket

// ✅ Middleware
// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // Required for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] // <-- add this
};


app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());

// ✅ Rate limit for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many login attempts. Try again later.'
});

// ✅ Base Route
app.get('/', (req, res) => {
  res.send('Welcome to the PWD ID Application API!');
});

// ✅ Routes
app.use('/api/secure/auth', authController.verifyRole);


app.use('/api/auth/admin/limiter', loginLimiter); // Rate-limit admin login
app.use('/api/auth/admin', adminAuthRoutes);

app.use('/api/auth/employee/limiter', loginLimiter); // Rate-limit employee login
app.use('/api/auth/employee', employeeAuthRoutes);

app.use('/api', adminRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/secure', protectedRoutes);
app.use('/api/Documents', fileRoutes);

// ✅ Serve Uploaded Documents
app.use('/uploads', express.static(path.join(__dirname, 'Documents')));

// ✅ WebSocket Setup
startWebSocketServer(server, pool);

// ✅ Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
