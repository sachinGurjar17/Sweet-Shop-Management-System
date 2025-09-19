const express = require('express');
const Sweet = require('../models/Sweet');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, adminAuth, async (req, res) => {
  const { name, category, price, quantity, description, imageUrl } = req.body;

  if (!name || !category || price == null || quantity == null) {
    return res.status(400).json({ error: 'Missing required sweet information' });
  }

  const existingSweet = await Sweet.findOne({ name });
  if (existingSweet) {
    return res.status(400).json({ error: 'Sweet already exists' });
  }

  const sweet = new Sweet({ name, category, price, quantity, description, imageUrl });
  await sweet.save();

  res.status(201).json({ message: 'Sweet added successfully', sweet });
});

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const sweets = await Sweet.find().skip(skip).limit(limit).sort({ createdAt: -1 });
  const total = await Sweet.countDocuments();

  res.json({
    sweets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

router.get('/:id', async (req, res) => {
  const sweet = await Sweet.findById(req.params.id);
  if (!sweet) return res.status(404).json({ error: 'Sweet not found' });
  res.json({ sweet });
});

router.put('/:id', auth, adminAuth, async (req, res) => {
  const updateData = req.body;
  const sweet = await Sweet.findByIdAndUpdate(req.params.id, updateData, { new: true });

  if (!sweet) return res.status(404).json({ error: 'Sweet not found' });

  res.json({ message: 'Sweet updated', sweet });
});

router.delete('/:id', auth, adminAuth, async (req, res) => {
  const sweet = await Sweet.findByIdAndDelete(req.params.id);
  if (!sweet) return res.status(404).json({ error: 'Sweet not found' });
  res.json({ message: 'Sweet deleted', sweet });
});

router.post('/:id/purchase', auth, async (req, res) => {
  const quantity = parseInt(req.body.quantity);
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Invalid purchase quantity' });
  }

  const sweet = await Sweet.findById(req.params.id);
  if (!sweet) return res.status(404).json({ error: 'Sweet not found' });

  if (sweet.quantity < quantity) {
    return res.status(400).json({ error: 'Insufficient stock' });
  }

  sweet.quantity -= quantity;
  await sweet.save();

  res.json({ message: 'Purchase successful', purchasedQuantity: quantity, remainingQuantity: sweet.quantity });
});

router.post('/:id/restock', auth, adminAuth, async (req, res) => {
  const quantity = parseInt(req.body.quantity);
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Invalid restock quantity' });
  }

  const sweet = await Sweet.findById(req.params.id);
  if (!sweet) return res.status(404).json({ error: 'Sweet not found' });

  sweet.quantity += quantity;
  await sweet.save();

  res.json({ message: 'Restocked successfully', restockedQuantity: quantity, newQuantity: sweet.quantity });
});

module.exports = router;
