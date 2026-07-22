import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.NOTIFICATION_SERVICE_PORT || '3006', 10),
};
