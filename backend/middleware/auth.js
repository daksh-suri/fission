import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

const auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Access denied. No token provided', 401));
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return next(new AppError('Invalid token', 401));
  }
};

export default auth;
