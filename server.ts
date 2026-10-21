import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { app as apiApp } from './lib/app.ts';
import { getMongoDb } from './lib/mongo.ts';

dotenv.config();

async function startServer() {
  const app = express();

  // Parse port from CLI flags (--port 3000) or process.env.PORT, default to 3000
  let port = 3000;
  if (process.env.PORT) {
    port = parseInt(process.env.PORT, 10);
  }
  const portIndex = process.argv.indexOf('--port');
  if (portIndex !== -1 && process.argv[portIndex + 1]) {
    port = parseInt(process.argv[portIndex + 1], 10);
  }

  // Enable CORS for mobile APK (Capacitor https://localhost / capacitor://localhost)
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json({ limit: '15mb' }));

  // Non-blocking MongoDB connection heartbeat check
  getMongoDb()
    .then((db) => {
      if (db) {
        console.log('🟢 MongoDB Atlas: Connected to "WellsFargo" database.');
      } else {
        console.log('ℹ️ Local Banking Store active (MongoDB Atlas optional).');
      }
    })
    .catch((err) => console.warn('⚠️ MongoDB Atlas warning:', err.message));

  // Mount consolidated API application
  app.use(apiApp);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Server is running at http://0.0.0.0:${port}`);
  });
}

startServer();
