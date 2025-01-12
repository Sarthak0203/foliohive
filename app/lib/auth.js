//lib/auth.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const SECRET_KEY = process.env.JWT_SECRET;
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET;
const SALT_ROUNDS = 12;

// Token configuration
const TOKEN_CONFIG = {
  access: {
    expiresIn: '15m',
    type: 'access'
  },
  refresh: {
    expiresIn: '7d',
    type: 'refresh'
  }
};

// Custom error class for authentication errors
class AuthError extends Error {
  constructor(message, code = 'AUTH_ERROR') {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

// Generate access token
export const generateAccessToken = (user) => {
  if (!user?._id) throw new AuthError('Invalid user data', 'INVALID_USER');
  
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      type: TOKEN_CONFIG.access.type
    },
    SECRET_KEY,
    { expiresIn: TOKEN_CONFIG.access.expiresIn }
  );
};

// Generate refresh token
export const generateRefreshToken = (user) => {
  if (!user?._id) throw new AuthError('Invalid user data', 'INVALID_USER');
  
  return jwt.sign(
    {
      id: user._id,
      type: TOKEN_CONFIG.refresh.type
    },
    REFRESH_SECRET_KEY,
    { expiresIn: TOKEN_CONFIG.refresh.expiresIn }
  );
};

// Generate both tokens
export const generateTokenPair = (user) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user)
  };
};

// Verify access token
export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.type !== TOKEN_CONFIG.access.type) {
      throw new AuthError('Invalid token type', 'INVALID_TOKEN_TYPE');
    }
    return decoded;
  } catch (err) {
    if (err instanceof AuthError) throw err;
    if (err.name === 'TokenExpiredError') {
      throw new AuthError('Token expired', 'TOKEN_EXPIRED');
    }
    throw new AuthError('Invalid token', 'INVALID_TOKEN');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET_KEY);
    if (decoded.type !== TOKEN_CONFIG.refresh.type) {
      throw new AuthError('Invalid token type', 'INVALID_TOKEN_TYPE');
    }
    return decoded;
  } catch (err) {
    if (err instanceof AuthError) throw err;
    if (err.name === 'TokenExpiredError') {
      throw new AuthError('Refresh token expired', 'REFRESH_TOKEN_EXPIRED');
    }
    throw new AuthError('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
  }
};

// Hash password with additional security measures
export const hashPassword = async (password, saltRounds = 10) => { // Add optional saltRounds parameter
  if (!password || password.length < 8) {
    throw new AuthError('Password must be at least 8 characters long', 'INVALID_PASSWORD');
  }
  
  try {
    const salt = await bcrypt.genSalt(saltRounds); // Use saltRounds here
    return await bcrypt.hash(password, salt);
  } catch (err) {
    throw new AuthError('Password hashing failed', 'HASH_ERROR');
  }
};

// Compare password with additional validation
export const comparePassword = async (password, hash) => {
  if (!password || !hash) {
    throw new AuthError('Password and hash are required', 'MISSING_CREDENTIALS');
  }
  
  console.log('Password length:', password.length);
  console.log('Password characters:', [...password].map(c => c.charCodeAt(0)));
  console.log('Hash length:', hash.length);
  
  try {
    const isMatch = await bcrypt.compare(password, hash);
    console.log('Password match:', isMatch);
    return isMatch;
  } catch (err) {
    console.error('Bcrypt compare error:', err);
    throw new AuthError('Password comparison failed', 'COMPARE_ERROR');
  }
};


// Generate secure reset token
export const generateResetToken = () => {
  return uuidv4();
};

// Rate limiting utility (to be used with Redis in production)
const rateLimitMap = new Map();

export const checkRateLimit = (key, limit = 5, windowMs = 15 * 60 * 1000) => {
  const now = Date.now();
  const attempts = rateLimitMap.get(key) || [];
  
  // Clean old attempts
  const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
  
  if (validAttempts.length >= limit) {
    throw new AuthError('Too many attempts. Please try again later.', 'RATE_LIMIT_EXCEEDED');
  }
  
  validAttempts.push(now);
  rateLimitMap.set(key, validAttempts);
};

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AuthError('Invalid email format', 'INVALID_EMAIL');
  }
  return true;
};

// Validate password strength
export const validatePasswordStrength = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new AuthError(
      'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
      'WEAK_PASSWORD'
    );
  }
  return true;
};

// Sanitize user object before sending to client
export const sanitizeUser = (user) => {
  const { password, resetToken, resetTokenExpiry, ...safeUser } = user;
  return safeUser;
};

// Example usage of combining multiple auth functions
export const authenticateUser = async (email, password, ip) => {
  try {
    // Check rate limit
    checkRateLimit(`auth_${ip}`, 5, 15 * 60 * 1000);
    
    // Validate input
    validateEmail(email);
    validatePasswordStrength(password);
    
    // Authentication logic here...
    // This would typically involve checking the database
    
    return {
      success: true,
      data: {
        tokens: generateTokenPair(user),
        user: sanitizeUser(user)
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};