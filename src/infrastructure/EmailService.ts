import nodemailer, { Transporter } from 'nodemailer';
import config from "../config/config";
import logger from "../infrastructure/logging/Logger"; 

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure, 
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async sendMail(options: EmailOptions): Promise<void> {
    try {
      logger.info(`Sending email to ${options.to} with subject "${options.subject}"`);
      
      await this.transporter.sendMail({
        from: config.email.from, // sender address
        ...options,
      });

      logger.info(`Email successfully sent to ${options.to}`);
    } catch (error) {
      logger.error(`Error sending email to ${options.to}:`, error);
      throw new Error('Failed to send email');
    }
  }
}

export default new EmailService();
