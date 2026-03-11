
// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import specs from './swagger.js';

import postRoutes from './routes/postRoutes.js';
import authRoutes from './routes/authRoutes.js';
import busRoutes from './routes/busRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'; 
import stopRoutes from './routes/stopRoutes.js';
//  ADD THIS
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';

import './models/Bus.js';
import './models/Stop.js';
import './models/User.js';
import './models/Post.js';
import './models/CommunityPost.js';
import './models/LiveLocation.js';
import './models/PostContent.js';
import './models/Report.js';
import './models/Notification.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;


// CREATE HTTP SERVER (required for Socket.IO)
const server = http.createServer(app);


// INITIALIZE SOCKET.IO AND EXPORT IT 
export const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});


// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log(' New Socket.IO client connected:', socket.id);

  
  // Handle location updates
  socket.on('location:update', (data) => {
    console.log('📍 Location update received:', data);
    socket.broadcast.emit('location:update', data);
  });

  
  // Handle new location
  socket.on('location:new', (data) => {
    console.log('📍 New location received:', data);
    socket.broadcast.emit('location:new', data);
  });

  
  // Handle location ended
  socket.on('location:ended', (data) => {
    console.log('🛑 Location ended:', data);
    socket.broadcast.emit('location:removed', data.locationId);
  });

  
  // Handle new notifications
  socket.on('notification:new', (data) => {
    console.log('🔔 New notification:', data);
    socket.broadcast.emit('notification:new', data);
  });

  
  // Handle notification read
  socket.on('notification:markRead', (data) => {
    console.log('📖 Notification marked as read:', data);
    socket.broadcast.emit('notification:read', data.notificationId);
  });

  
  // Handle notification mark all read
  socket.on('notification:markAllRead', (data) => {
    console.log('📖 All notifications marked as read');
    socket.broadcast.emit('notification:allRead');
  });

  
  // Handle notification delete
  socket.on('notification:delete', (data) => {
    console.log('🗑️ Notification deleted:', data);
    socket.broadcast.emit('notification:deleted', data.notificationId);
  });

  
  // Handle notification clear all
  socket.on('notification:clearAll', (data) => {
    console.log('🧹 All notifications cleared');
    socket.broadcast.emit('notification:cleared');
  });

  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('❌ Socket.IO client disconnected:', socket.id);
  });

  
  // Error handler
  socket.on('error', (error) => {
    console.error('❌ Socket.IO error:', error);
  });
});


// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Static Files
app.use(express.static(path.join(__dirname, 'public')));


// Session & Flash
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));
app.use(flash());


// Global Variables for Views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});


// CORS Configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/stops', stopRoutes);
app.use('/api/notifications', notificationRoutes); 
//  ADD THIS LINE
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


// Admin Routes (EJS)
app.use('/admin', adminRoutes);


// Root redirect
app.get('/', (req, res) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  }
  res.redirect('/admin/login');
});

app.use(errorHandler);


// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' MongoDB Connected');
  } catch (err) {
    console.error('❌ DB Error:', err);
    process.exit(1);
  }
};


// Start Server (using http.Server instead of app.listen)
const start = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http:
      //localhost:${PORT}`);
    console.log(`📊 Admin Panel: http:
      //localhost:${PORT}/admin/login`);
    console.log(`🔌 Socket.IO: ws:
      //localhost:${PORT}`);
  });
};

start();
