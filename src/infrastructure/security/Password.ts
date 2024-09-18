import bcrypt from 'bcrypt';
import config from '../../config/config';

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(config.salt);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export { hashPassword, comparePassword };
