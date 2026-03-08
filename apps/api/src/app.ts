import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './shared/config/env';
import { errorHandler } from './shared/errors/error-handler';

// Routes
import serviceRoutes from './modules/services/presentation/service.routes';
import productRoutes from './modules/products/presentation/product.routes';
import categoryRoutes from './modules/categories/presentation/category.routes';
import dashboardRoutes from './modules/dashboard/presentation/dashboard.routes';
import insightsRoutes from './modules/insights/presentation/insights.routes';
import inventoryRoutes from './modules/inventory/presentation/inventory.routes';
import paymentMethodRoutes from './modules/payment-methods/presentation/payment-method.routes';
import saleRoutes from './modules/sales/presentation/sale.routes';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api/services', serviceRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/insights', insightsRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/payment-methods', paymentMethodRoutes);
  app.use('/api/sales', saleRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Route not found',
    });
  });

  // Error handler
  app.use(errorHandler);

  return app;
};

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
};
