import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import vendorRoutes from './routes/vendors.js';
import vettingRoutes from './routes/vetting.js';
import cityRoutes from './routes/cities.js';
import contactRoutes from './routes/contact.js';
import sponsorRoutes from './routes/sponsors.js';
import celebrityRoutes from './routes/celebrity.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Chillings Entertainment API Documentation',
}));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Chillings Entertainment API is running
 */
app.get('/health', async (req, res) => {
  try {
    // Test Supabase connection
    const { supabase } = await import('./config/supabase.js');
    const { error } = await supabase.from('users').select('count').limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is fine
      return res.status(503).json({ 
        status: 'error', 
        message: 'Database connection failed',
        error: error.message 
      });
    }
    
    res.json({ 
      status: 'ok', 
      message: 'Chillings Entertainment API is running',
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      message: 'Health check failed',
      error: error.message 
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
console.log('Auth routes registered at /api/auth');
// Test route registration
app.get('/api/test-routes', (req, res) => {
  res.json({ 
    message: 'Routes are working',
    authRoutes: 'Registered at /api/auth',
    testEndpoint: '/api/auth/me should work'
  });
});
app.use('/api/events', eventRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/vetting', vettingRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/celebrity', celebrityRoutes);

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  console.log('Available routes:', {
    auth: '/api/auth/*',
    events: '/api/events/*',
    vendors: '/api/vendors/*',
    cities: '/api/cities/*',
    contact: '/api/contact/*',
    sponsors: '/api/sponsors/*',
    vetting: '/api/vetting/*',
    celebrity: '/api/celebrity/*'
  });
  res.status(404).json({ error: 'Route not found', path: req.originalUrl, method: req.method });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

