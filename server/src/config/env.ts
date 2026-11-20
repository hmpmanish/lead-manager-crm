import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file if present
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters long'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formattedErrors = result.error.format();
    console.error('CRITICAL: Environment variable validation failed:');
    console.error(JSON.stringify(formattedErrors, null, 2));
    throw new Error('Invalid environment configuration. Check your .env file.');
  }
  return result.data;
};

export const env = parseEnv();
