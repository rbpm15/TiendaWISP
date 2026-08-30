import dotenv from 'dotenv';
import path from 'path';

// Intentar cargar el .env desde la raíz del monorepo
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
// Fallback en caso de que esté en el directorio actual
dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl: process.env.DATABASE_URL ?? '',
  openrouterApiKey: process.env.OPENROUTER_API_KEY ?? '',
  aiModel: process.env.AI_MODEL ?? 'google/gemini-2.5-flash',
} as const;
