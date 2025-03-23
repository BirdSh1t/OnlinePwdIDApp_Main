import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; // ✅ Import the routes

const app = express(); 

// ✅ Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); 

// ✅ Use Routes
app.use('/api/auth', authRoutes); // 🔥 Prefix all auth routes with `/api/auth`

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
