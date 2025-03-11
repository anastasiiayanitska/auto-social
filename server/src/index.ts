import express, { Application } from 'express';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRouter';
import interactionRoutes from './routes/interactionRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';

const app: Application = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log('Server is listening on port:', PORT);
    });
  } catch (error) {
    console.error('Error listening server:', error);
  }
};

startServer();
