import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express(); 

// ✅ Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the PWD ID Application API!');
});

// ✅ Use Routes
app.use('/api/auth', authRoutes);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
