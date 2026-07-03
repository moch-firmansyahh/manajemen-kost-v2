import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import kamarRoutes from './routes/kamar.routes';
import penghuniRoutes from './routes/penghuni.routes';
import pembayaranRoutes from './routes/pembayaran.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/kamar', kamarRoutes);
app.use('/api/penghuni', penghuniRoutes);
app.use('/api/pembayaran', pembayaranRoutes);
app.use('/api', authRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
