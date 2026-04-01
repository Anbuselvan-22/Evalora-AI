import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  );
};

// Mock users for development/testing without MongoDB
const MOCK_USERS = {
  'teacher@example.com': {
    id: '507f1f77bcf86cd799439011',
    email: 'teacher@example.com',
    password: 'password123',
    role: 'teacher',
    name: 'John Teacher',
  },
  'student@example.com': {
    id: '507f1f77bcf86cd799439012',
    email: 'student@example.com',
    password: 'password123',
    role: 'student',
    name: 'Jane Student',
  },
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and role are required',
        code: 'MISSING_FIELDS',
      });
    }

    if (!['teacher', 'student'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be teacher or student.',
        code: 'INVALID_ROLE',
      });
    }

    // Try database first, fall back to mock users
    let user = null;
    try {
      user = await User.findOne({ email }).select('+password');
    } catch (dbError) {
      // Database not available, use mock
      console.log('Database unavailable, using mock users for testing');
    }

    if (!user && MOCK_USERS[email]) {
      user = MOCK_USERS[email];
    } else if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Check role match
    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message: `This user is registered as ${user.role}, not ${role}`,
        code: 'ROLE_MISMATCH',
      });
    }

    // Check password (for mock users, direct comparison)
    const isPasswordValid = user.comparePassword
      ? await user.comparePassword(password)
      : user.password === password;

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Generate token
    const token = generateToken(user.id || user._id, user.role);

    // Remove password from response
    const userResponse = {
      id: user.id || user._id,
      email: user.email,
      role: user.role,
      name: user.name || '',
    };

    return res.status(200).json({
      success: true,
      data: {
        token,
        role: user.role,
        user: userResponse,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, password, role, name } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and role are required',
        code: 'MISSING_FIELDS',
      });
    }

    if (!['teacher', 'student'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be teacher or student.',
        code: 'INVALID_ROLE',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
        code: 'EMAIL_EXISTS',
      });
    }

    // Create user
    const user = new User({ email, password, role, name });
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      data: {
        token,
        role: user.role,
        user: userResponse,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
};

export default { login, signup };
