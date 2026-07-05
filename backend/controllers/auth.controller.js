import * as authService from '../services/authService.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required', 400);
  }

  const result = await authService.signup({ name, email, password });

  res.status(201).json({ success: true, data: result });
});

export const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const result = await authService.signin({ email, password });

  res.status(200).json({ success: true, data: result });
});
