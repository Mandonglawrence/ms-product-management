import * as dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();

interface Config {
    salt: number;
    port: number;
    dbUri: string;
    jwtSecret: string;
    email: {
        host: string;
        port: number;
        user: string;
        pass: string;
        secure: boolean;
        from: string;
    }
}

const config: Config = {
    port: parseInt(process.env.PORT || '3000', 10),
    salt: parseInt(process.env.SALT || '10', 10),
    dbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    email: {
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        user: process.env.SMTP_USER || 'user@example.com',
        pass: process.env.SMTP_PASS || 'your_smtp_password',
        secure: parseInt(process.env.SMTP_PORT || '587', 10) == 465 ? true : false,
        from: process.env.SMTP_SENDER || 'user@example.com'
    }
};

export default config;
