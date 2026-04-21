import express, { Express, Request, Response } from 'express';

const app: Express = express();
const PORT = 8000;

// Middleware
app.use(express.json());

// Root GET route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to MajiHub API Server',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});
app.get('/api/docs', (req: Request, res: Response) => {
    res.json({
        message: 'Welcome to MajiHub API Documentation',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`🚀 Server is running at ${url}`);
  console.log(`📝 API Documentation: ${url}/api/docs`);
});

