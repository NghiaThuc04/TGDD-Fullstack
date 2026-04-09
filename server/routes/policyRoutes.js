const express = require('express');
const router = express.Router();
const Policy = require('../models/Policy');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/policies — Lấy danh sách tất cả (dành cho Admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const policies = await Policy.find().select('slug title updatedAt').sort({ updatedAt: -1 });
    res.json(policies);
  } catch (e) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách chính sách' });
  }
});

// GET /api/policies/:slug — Lấy một chính sách (dành cho Client hiển thị)
router.get('/:slug', async (req, res) => {
  try {
    const policy = await Policy.findOne({ slug: req.params.slug });
    if (!policy) return res.status(404).json({ message: 'Không tìm thấy trang này' });
    res.json(policy);
  } catch (e) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT /api/policies/:slug — Tạo mới hoặc cập nhật (upsert)
router.put('/:slug', protect, adminOnly, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Tiêu đề và nội dung không được để trống' });
    }
    const policy = await Policy.findOneAndUpdate(
      { slug: req.params.slug },
      { title, content, slug: req.params.slug },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(policy);
  } catch (e) {
    res.status(500).json({ message: 'Lỗi khi lưu chính sách' });
  }
});

module.exports = router;
