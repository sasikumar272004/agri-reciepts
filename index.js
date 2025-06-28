import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import errorHandler from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import receiptsRoutes from './routes/receiptsRoutes.js';
import supervisorRoutes from './routes/supervisorRoutes.js';
import jdRoutes from './routes/jdRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true,
}));

await connectDB(); 

app.use("/api/auth", authRoutes);
app.use("/api/receipts", receiptsRoutes);
app.use("/api/supervisor", supervisorRoutes);
app.use("/api/jd", jdRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
