const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import controllers
const { register, login } = require('./controllers/authController');
const { 
  reportLostItem, 
  getLostItems, 
  getMyReports, 
  getItemById,
  updateItem,
  deleteItem
} = require('./controllers/itemController');

// Import Found Item controllers
const {
  reportFoundItem,
  getFoundItems,
  getMyFoundReports,
  getFoundItemById,
  verifySecurityAnswer,
  updateFoundItem,
  deleteFoundItem,
  markAsClaimed
} = require('./controllers/foundItemController');

// Import middleware
const { protect } = require('./middlewares/authMiddleware');

const app = express();

// Middleware - UPDATED CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // ✅ Both ports
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// ========== AUTH ROUTES ==========
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', protect, async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

// ========== LOST ITEM ROUTES ==========
// Public routes
app.get('/api/items/lost', getLostItems);
app.get('/api/items/:id', getItemById);

// Protected routes
app.post('/api/items/report', protect, reportLostItem);
app.get('/api/items/my-reports', protect, getMyReports);
app.put('/api/items/:id', protect, updateItem);
app.delete('/api/items/:id', protect, deleteItem);

// ========== FOUND ITEM ROUTES ==========
// Public routes
app.get('/api/found-items', getFoundItems);
app.get('/api/found-items/:id', getFoundItemById);
app.post('/api/found-items/:id/verify', verifySecurityAnswer);

// Protected routes
app.post('/api/found-items/report', protect, reportFoundItem);
app.get('/api/found-items/my-reports', protect, getMyFoundReports);
app.put('/api/found-items/:id', protect, updateFoundItem);
app.delete('/api/found-items/:id', protect, deleteFoundItem);
app.put('/api/found-items/:id/claim', protect, markAsClaimed);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'TraceIt API is running...' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});