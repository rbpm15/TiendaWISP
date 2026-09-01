import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { healthRouter } from './routes/health.routes.js';
import { productRouter } from './routes/product.routes.js';
import { stockRouter } from './routes/stock.routes.js';
import { dashboardRouter } from './routes/dashboard.routes.js';
import { aiRouter } from './routes/ai.routes.js';
import { customerRouter } from './routes/customer.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/api/products', productRouter);
  app.use('/api/stock', stockRouter);
  app.use('/api/dashboard', dashboardRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/customers', customerRouter);

  // Serve static frontend in production
  if (process.env.NODE_ENV === 'production') {
    const frontendDist = path.join(__dirname, '../../../../frontend/dist');
    app.use(express.static(frontendDist));
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }

  return app;
};
