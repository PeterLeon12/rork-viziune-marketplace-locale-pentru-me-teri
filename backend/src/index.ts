import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './trpc/app-router';
import { createContext } from './trpc/create-context';
import { closeDb } from './db';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = new Hono();

// Enable CORS
app.use('*', cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Health check endpoint
app.get('/', (c) => {
  return c.json({ 
    status: 'ok', 
    message: 'Rork Marketplace API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount tRPC router
app.use('/trpc/*', trpcServer({
  endpoint: '/trpc',
  router: appRouter,
  createContext,
}));

// Error handling middleware
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  }, 500);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await closeDb();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down server...');
  await closeDb();
  process.exit(0);
});

const port = parseInt(process.env.PORT || '3000');

console.log(`🚀 Server starting on port ${port}...`);
console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔗 tRPC endpoint: http://localhost:${port}/trpc`);

serve({
  fetch: app.fetch,
  port,
});
