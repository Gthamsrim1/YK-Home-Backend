const mongoose = require('mongoose');
const Recipe = require('../../models/Recipe');

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

const allowedOrigins = [
  'http://localhost:5173',
  'https://www.ykhomefoods.com',
  'http://ykhomefoods.com',
  'https://ykhomefoods.com'
];

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

  try {
    if (req.method === 'GET') {
      const recipes = await Recipe.find().sort({ createdAt: -1 });
      res.status(200).json(recipes);
    } else if (req.method === 'POST') {
      const newRecipe = new Recipe(req.body);
      const saved = await newRecipe.save();
      res.status(201).json(saved);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
