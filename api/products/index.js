const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Product = require('../../models/Product');
const JWT_SECRET = process.env.JWT_SECRET;

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('DB connection error:', error);
  }
};

// CORS config
const allowedOrigins = ['http://localhost:5173', 'https://www.ykhomefoods.com', 'http://ykhomefoods.com'];

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await connectDB();

  // ✅ Token check after OPTIONS
  try {
    const auth = req.headers.authorization || '';
    const token = auth.split(' ')[1];
    if (!token) throw new Error('Missing token');
    jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      const products = await Product.find().sort({ createdAt: -1 });
      res.status(200).json(products);
    } else if (req.method === 'POST') {
      const newProduct = new Product(req.body);
      const saved = await newProduct.save();
      res.status(201).json(saved);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
