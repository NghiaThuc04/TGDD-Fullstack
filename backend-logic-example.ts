
/**
 * VÍ DỤ TRIỂN KHAI MIDDLEWARE Ở BACKEND (NODE.JS + EXPRESS)
 * File này chỉ để mô tả code thực tế chạy trên server.
 */

/*
// File: middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// Middleware xác thực token cơ bản
exports.protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Vui lòng đăng nhập' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Dữ liệu user bao gồm { id, role, ... }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

// MIDDLEWARE KIỂM TRA QUYỀN ADMIN (Theo yêu cầu)
exports.adminOnly = (req, res, next) => {
    // 1. Kiểm tra xem user đã qua middleware 'protect' chưa
    // 2. Kiểm tra thuộc tính role
    if (req.user && req.user.role === 'admin') {
        next(); // Cho phép đi tiếp
    } else {
        // 3. Trả về 403 Forbidden nếu là Customer
        return res.status(403).json({ 
            status: 'fail',
            message: '403 Forbidden: Bạn không có quyền thực hiện hành động này!' 
        });
    }
};

// File: routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');

// ROUTE CÔNG KHAI (Customer & Admin đều xem được)
router.get('/', productController.getAllProducts);

// ROUTES BẢO MẬT (Chỉ Admin mới có quyền gọi)
router.post('/', protect, adminOnly, productController.createProduct);
router.put('/:id', protect, adminOnly, productController.updateProduct);
router.delete('/:id', protect, adminOnly, productController.deleteProduct);

module.exports = router;
*/
