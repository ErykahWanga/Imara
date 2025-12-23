import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

const config = loadEnv(process.env.NODE_ENV, 'development');

// Create Express app for backend API
const api = express();

// Security middleware
api.use(helmet());
api.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true
}));
api.use(express.json({ limit: '10mb' }));
api.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

api.use(limiter);

// Proxy requests to backend
api.use('/api', (req, res) => {
  const targetUrl = `${config.API_BASE_URL}${req.originalUrl}`;
  
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
        // Forward Authorization header if present
        ...(req.headers.authorization && { Authorization: req.headers.authorization })
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();

    // Forward response with same status and headers
    Object.entries(response.headers).forEach(([key, value]) => {
      if (key.toLowerCase() !== 'content-length') {
        res.setHeader(key, value);
      }
    });

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Serve React app for all other routes
api.use(express.static('dist'));

// Handle React Router
app.use('*', (req, res) => {
  res.sendFile('dist/index.html');
});

export default api;