import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import fargoHandler from './api/fargo';
import healthHandler from './api/health';
import loanHandler from './api/loan';
import ratesHandler from './api/rates';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Mount API endpoints
  app.all('/api/fargo', (req, res) => fargoHandler(req, res));
  app.all('/api/health', (req, res) => healthHandler(req, res));
  app.all('/api/loan', (req, res) => loanHandler(req, res));
  app.all('/api/rates', (req, res) => ratesHandler(req, res));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
