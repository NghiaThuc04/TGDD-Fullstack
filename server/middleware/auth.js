const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'onlybuyer_secret_key_change_in_production';

/**
 * Middleware xác thực JWT token
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Vui lòng đăng nhập để tiếp tục' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

/**
 * Middleware kiểm tra quyền admin
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    message: '403 Forbidden: Bạn không có quyền thực hiện hành động này!'
  });
};

/**
 * Middleware kiểm tra quyền admin hoặc staff
 */
const staffOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'staff')) {
    return next();
  }
  return res.status(403).json({
    message: '403 Forbidden: Chỉ nhân viên và quản trị viên mới có quyền truy cập!'
  });
};

module.exports = { protect, adminOnly, staffOrAdmin, JWT_SECRET };
