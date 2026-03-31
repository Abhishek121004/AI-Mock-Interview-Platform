// ============================================
// app.js - Express Application Setup
// ============================================
// This file configures the Express app with:
//   - CORS (so React frontend can talk to us)
//   - Body parsing (JSON + large payloads)
//   - API routes
//   - Error handling
// ============================================

// import express from 'express';
// import cors from 'cors';

// // Import all routes (bundled in one index file)
// import routes from './routes/index.js';

// // Import the global error handler
// import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

// // ---- Create the Express App ----
// const app = express();

// // ============================================
// // MIDDLEWARE (runs on every request, in order)
// // ============================================

// // 1. CORS: Allow our frontend (React) to talk to this backend
// //    Without this, browsers will block requests from localhost:5173 → localhost:5000
// app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));

// // 2. Body Parser: Convert incoming JSON requests to JavaScript objects
// //    10mb limit to handle large resume text and interview data
// app.use(express.json({ limit: '10mb' }));

// // ============================================
// // ROUTES
// // ============================================

// // Mount all API routes under /api
// // /api/auth      → authentication routes
// // /api/interview → interview routes (start, answer, feedback)
// // /api/resume    → resume upload and parsing routes
// // /api/history   → interview history routes
// app.use('/api', routes);

// // ============================================
// // ERROR HANDLING (must be AFTER routes)
// // ============================================

// // Handle 404 - Route not found
// app.use(notFoundHandler);

// // Handle all other errors (500, validation errors, etc.)
// app.use(errorHandler);

// // Export the app (used in server.js)
// export default app;

import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

const app = express();

// Trust proxy (important for Render)
app.set('trust proxy', 1);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://aipoweredmockinterviewplatform.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// API routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;