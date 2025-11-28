// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import swaggerUi from 'swagger-ui-express';
import specs from './swagger.js';

import postRoutes from './routes/postRoutes.js';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';

// Import models in order (Post first, then discriminators)
import './models/Bus.js'; 
import './models/Stop.js';   
import './models/User.js';   
import './models/Post.js';
import './models/CommunityPost.js'; // ADDED: Discriminator
import './models/LiveLocation.js';  // ADDED: Discriminator
import './models/PostContent.js';
import './models/Report.js';
import './models/Notification.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reports', reportRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Error Handler must be last
app.use(errorHandler);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('DB Error:', err);
    process.exit(1);
  }
};

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start();
