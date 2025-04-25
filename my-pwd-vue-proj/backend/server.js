import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import applicantRoutes from './routes/applicantRoutes.js';
import { createServer } from 'http';
import { startWebSocketServer } from './websocketServer.js';
import { pool } from './config/database.js'; // Assuming you export pool here
import fileRoutes from './routes/fileRoutes.js';



const app = express();
const server = createServer(app); // HTTP server needed for WebSocket

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the PWD ID Application API!');
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api', adminRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/Documents', fileRoutes); 
// ✅ WebSocket setup
startWebSocketServer(server, pool);

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
