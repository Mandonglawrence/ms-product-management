import jwt from 'jsonwebtoken';
import config from '../../config/config';

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '1h' });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwtSecret);
};

export { generateToken, verifyToken };
